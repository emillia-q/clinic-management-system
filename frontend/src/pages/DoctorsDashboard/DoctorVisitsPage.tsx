import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { DateStripline } from "../../components/receptionist/DateStripline";
import { SegmentedTabs } from "../../shared/ui/SegmentedTabs";
import {
    BTN_PANEL_OUTLINE,
    BTN_PANEL_PRIMARY,
    BTN_PANEL_SUCCESS,
    DASHBOARD_PAGE_CLASS,
    DetailFieldLabel,
    PAGE_TITLE_CLASS,
    PANEL_TITLE_CLASS,
    StatusBadge,
    TABLE_CARD_CLASS,
    TABLE_HEAD_ROW_CLASS,
} from "../../shared/ui";
interface Visit {
    id: number;
    patientName: string;
    socialSecurityNo: string;
    appointmentDate: string;
    status: string;
    description: string;
    diagnosis?: string;
}

interface DoctorVisitsPageProps {
    onOrderExam: (visitId: number) => void;
    selectedVisitId?: number | null;
    onSelectedVisitIdChange?: (visitId: number | null) => void;
}

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1")
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const DoctorVisitsPage = ({ onOrderExam, selectedVisitId, onSelectedVisitIdChange }: DoctorVisitsPageProps) => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [activeTab, setActiveTab] = useState<string>('All');
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

    const tabs = ['All', 'Registered', 'In Progress', 'Finished', 'Cancelled'];

    const fetchVisits = useCallback(async () => {
        try {
            const doctorId = localStorage.getItem('userId');
            const response = await api.get('/visits', {
                params: {
                    doctorId: doctorId,
                    fromDate: selectedDate,
                    toDate: selectedDate
                }
            });
            setVisits(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [selectedDate]);

    useEffect(() => {
        void fetchVisits();
    }, [fetchVisits]);

    useEffect(() => {
        if (selectedVisitId == null) {
            setSelectedVisit(null);
            return;
        }
        if (selectedVisit?.id === selectedVisitId) {
            return;
        }
        const visit = visits.find(v => v.id === selectedVisitId);
        if (visit) {
            setSelectedVisit(visit);
        }
    }, [visits, selectedVisitId, selectedVisit?.id]);
    const handleStartVisit = async () => {
        if (!selectedVisit) return;
        try {
            await api.patch('/doctors/visits/start', {
                visitId: selectedVisit.id,
                description: selectedVisit.description || "Started",
                diagnosis: ""
            });
            updateLocalStatus('In Progress');
        } catch (error) {
            console.error("Start error:", error);
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : 'Failed to start visit';
            toast.error(message);
        }
    };

    const handleFinishVisit = async () => {
        if (!selectedVisit) return;
        try {
            await api.patch('/doctors/visits/finish', {
                visitId: selectedVisit.id,
                description: selectedVisit.description || "Finished",
                diagnosis: selectedVisit.diagnosis || ""
            });
            updateLocalStatus('Finished');
        } catch (error) {
            console.error("Finish error:", error);
        }
    };

    const handleCancelVisit = async () => {
        if (!selectedVisit) return;
        if (!window.confirm("Are you sure you want to cancel this visit?")) return;

        try {
            await api.patch('/doctors/visits/cancel', {
                visitId: selectedVisit.id,
                description: selectedVisit.description || "Cancelled by doctor",
                diagnosis: ""
            });
            updateLocalStatus('Cancelled');
        } catch (error) {
            console.error("Cancel error:", error);
        }
    };

    const updateLocalStatus = (newStatus: string) => {
        if (!selectedVisit) return;
        const updated = { ...selectedVisit, status: newStatus };
        setSelectedVisit(updated);
        setVisits(prev => prev.map(v => v.id === selectedVisit.id ? updated : v));
    };

    const isInProgress = (status: string) => {
        const s = (status || "").toLowerCase();
        return s === 'in progress' || s === 'inprogress' || s === 'in_progress';
    };

    const filteredVisits = activeTab === 'All'
        ? visits
        : visits.filter(v => (v.status || "").toLowerCase() === activeTab.toLowerCase());

    return (
        <div className={DASHBOARD_PAGE_CLASS}>
            <div className="mb-5">
                <DateStripline
                    selectedDate={selectedDate}
                    onDateChange={(date: string) => {
                        setSelectedDate(date);
                        setSelectedVisit(null);
                        onSelectedVisitIdChange?.(null);
                    }}
                />
            </div>

            <div className="row g-4">
                <div className={selectedVisit ? "col-md-8" : "col-md-12"} style={{transition: 'all 0.3s ease'}}>
                    <header className="mb-4 text-start">
                        <h2 className={PAGE_TITLE_CLASS}>Doctor's Appointments</h2>
                    </header>

                    <SegmentedTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(tab) => {
                            setActiveTab(tab);
                            setSelectedVisit(null);
                            onSelectedVisitIdChange?.(null);
                        }}
                        className="mb-4"
                    />

                    <div className={`${TABLE_CARD_CLASS} rounded-3 overflow-hidden`}>
                        <div className="card-body p-0">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="bg-light">
                                <tr className={TABLE_HEAD_ROW_CLASS}>
                                    <th className="px-4 py-3">Time</th>
                                    <th className="py-3">Patient</th>
                                    <th className="py-3">Status</th>
                                </tr>
                                </thead>
                                <tbody className="text-start">
                                {filteredVisits.map(v => (
                                    <tr
                                        key={v.id}
                                        onClick={() => {
                                            setSelectedVisit(v);
                                            onSelectedVisitIdChange?.(v.id);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedVisit?.id === v.id ? 'table-active' : ''}
                                    >
                                        <td className="fw-bold ps-4">
                                            {new Date(v.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                        <td>{v.patientName}</td>
                                        <td>
                                            <StatusBadge status={v.status} domain="visit" padded={false} />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {selectedVisit && (
                    <div className="col-md-4">
                        <div className={`${TABLE_CARD_CLASS} rounded-3 overflow-hidden text-start`}>
                            <div className="card-header bg-white border-0 pt-3 px-3 d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 className={PANEL_TITLE_CLASS}>Visit Details</h5>
                                    <p className="text-muted small mb-0">{selectedVisit.patientName}</p>
                                </div>
                                <button className="btn-close" onClick={() => {
                                    setSelectedVisit(null);
                                    onSelectedVisitIdChange?.(null);
                                }}></button>
                            </div>

                            <div className="card-body px-4 pb-4">
                                <div className="mb-4 vstack gap-2">
                                    <div className="d-flex justify-content-between pb-2 border-bottom border-light">
                                        <DetailFieldLabel className="mb-0">Visit ID</DetailFieldLabel>
                                        <span className="fw-bold">#{selectedVisit.id}</span>
                                    </div>
                                    <div className="d-flex justify-content-between pb-2 border-bottom border-light">
                                        <DetailFieldLabel className="mb-0">Patient PESEL</DetailFieldLabel>
                                        <span className="fw-bold">{selectedVisit.socialSecurityNo || 'N/A'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <DetailFieldLabel className="mb-0">Visit Status</DetailFieldLabel>
                                        <StatusBadge status={selectedVisit.status} domain="visit" padded={false} />
                                    </div>
                                </div>

                                <div className="d-grid gap-2 pt-2">
                                    {selectedVisit.status === 'Registered' && (
                                        <>
                                            <button className={`${BTN_PANEL_PRIMARY} mb-2`} onClick={handleStartVisit}>
                                                <i className="fa-solid fa-play me-2"></i> Start Visit
                                            </button>
                                            <button className="btn btn-link text-danger text-decoration-none btn-sm fw-bold border-0 p-0" onClick={handleCancelVisit}>
                                                Cancel Appointment
                                            </button>
                                        </>
                                    )}

                                    {isInProgress(selectedVisit.status) && (
                                        <>
                                            <button className={`${BTN_PANEL_OUTLINE} mb-2`} onClick={() => onOrderExam(selectedVisit.id)}>
                                                <i className="fa-solid fa-microscope me-2"></i> Order New Exam
                                            </button>
                                            <button className={`${BTN_PANEL_SUCCESS} mb-2 shadow-sm`} onClick={handleFinishVisit}>
                                                <i className="fa-solid fa-check me-2"></i> Finish Visit
                                            </button>
                                            <button className="btn btn-link text-danger text-decoration-none btn-sm fw-bold p-0" onClick={handleCancelVisit}>
                                                Cancel Visit (In Progress)
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
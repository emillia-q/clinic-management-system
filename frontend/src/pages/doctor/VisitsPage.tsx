import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { DateStripline } from "../../shared/ui/DateStripline";
import { SegmentedTabs } from "../../shared/ui";
import {
    DASHBOARD_PAGE_CLASS,
    PAGE_TITLE_CLASS,
    SPLIT_PANEL_TRANSITION_STYLE
} from "../../shared/ui/styles";

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
    onStartVisit: (visitId: number) => void;
}

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const DoctorVisitsPage = ({ onOrderExam, onStartVisit }: DoctorVisitsPageProps) => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [activeTab, setActiveTab] = useState<string>('All');
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

    const [showStartModal, setShowStartModal] = useState<boolean>(false);
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

    const tabs = ['All', 'Registered', 'Cancelled', 'In progress', 'Finished'];
    const flatlyDark = "#2C3E50";

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
        setSelectedVisit(null);
    }, [fetchVisits]);

    const handleConfirmStartVisit = async () => {
        if (!selectedVisit) return;
        setShowStartModal(false);
        try {
            await api.patch('/doctors/visits/start', {
                visitId: selectedVisit.id,
                description: null,
                diagnosis: null,
            });
            updateLocalStatus('In progress');
            onStartVisit(selectedVisit.id);
        } catch (error) {
            console.error(error);
            updateLocalStatus('In progress');
            onStartVisit(selectedVisit.id);
        }
    };

    const handleConfirmCancelVisit = async () => {
        if (!selectedVisit) return;
        setShowCancelModal(false);
        try {
            await api.patch('/doctors/visits/cancel', {
                visitId: selectedVisit.id,
                description: "Cancelled by doctor",
                diagnosis: ""
            });
            updateLocalStatus('Cancelled');
        } catch (error) {
            console.error(error);
            updateLocalStatus('Cancelled');
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
            console.error(error);
            updateLocalStatus('Finished');
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

    const getFormattedDateTime = (dateStr: string) => {
        const d = new Date(dateStr);
        const date = d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return { date, time };
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    return (
        <div className={DASHBOARD_PAGE_CLASS}>
            <div className="mb-4">
                <DateStripline
                    selectedDate={selectedDate}
                    onDateChange={(date: string) => {
                        setSelectedDate(date);
                        setSelectedVisit(null);
                    }}
                />
            </div>

            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2 className={PAGE_TITLE_CLASS}>
                    Upcoming Visits {isToday ? "(Today)" : `(${selectedDate})`}
                </h2>
            </header>

            <div className="row g-4">
                <div className={selectedVisit ? "col-md-8" : "col-md-12"} style={SPLIT_PANEL_TRANSITION_STYLE}>
                    <SegmentedTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(tab) => {
                            setActiveTab(tab);
                            setSelectedVisit(null);
                        }}
                    />

                    <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '4px' }}>
                        <div className="card-body p-0">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="table-light text-start text-uppercase small text-muted">
                                <tr>
                                    <th className="ps-4 py-3">Time</th>
                                    <th className="py-3">Patient</th>
                                    <th className="py-3">Status</th>
                                </tr>
                                </thead>
                                <tbody className="text-start">
                                {filteredVisits.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-4 text-muted fst-italic">
                                            No visits found for this criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVisits.map(v => (
                                        <tr
                                            key={v.id}
                                            onClick={() => setSelectedVisit(v)}
                                            style={{ cursor: 'pointer' }}
                                            className={selectedVisit?.id === v.id ? 'table-active' : ''}
                                        >
                                            <td className="fw-bold ps-4 py-3" style={{ color: flatlyDark }}>
                                                {new Date(v.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="fw-semibold text-dark">{v.patientName}</td>
                                            <td className="py-3">
                                                    <span className={`badge px-3 py-2 ${isInProgress(v.status) ? 'bg-success' : v.status === 'Finished' ? 'bg-secondary' : v.status === 'Cancelled' ? 'bg-danger' : 'bg-primary'}`} style={{ borderRadius: '4px', fontSize: '0.8rem' }}>
                                                        {v.status}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {selectedVisit && (
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm text-start bg-white" style={{ borderRadius: '4px' }}>
                            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-start">
                                <div className="w-100 me-2">
                                    <h4 className="fw-bold text-dark mb-1" style={{ fontSize: '1.4rem' }}>
                                        Visit Details
                                    </h4>
                                    <p className="text-muted small fw-semibold mb-0">Visit ID: {selectedVisit.id}</p>
                                </div>

                                <button
                                    className="btn btn-link text-muted p-0 border-0 text-decoration-none"
                                    type="button"
                                    onClick={() => setSelectedVisit(null)}
                                    style={{ fontSize: '1.4rem', lineHeight: '1', color: flatlyDark }}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            <div className="card-body px-4 pb-4">
                                <div className="d-flex flex-column gap-3 pt-2">
                                    <div>
                                        <span className="text-secondary small fw-bold d-block text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>Patient Name</span>
                                        <span className="fw-semibold text-dark fs-5">{selectedVisit.patientName}</span>
                                    </div>

                                    <div>
                                        <span className="text-secondary small fw-bold d-block text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>Patient PESEL</span>
                                        <span className="fw-semibold text-dark fs-5">{selectedVisit.socialSecurityNo || 'N/A'}</span>
                                    </div>

                                    <div>
                                        <span className="text-secondary small fw-bold d-block text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>Visit Time</span>
                                        <span className="fw-semibold text-dark fs-5">
                                            {new Date(selectedVisit.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-secondary small fw-bold d-block text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>Status</span>
                                        <div>
                                            <span className={`badge py-2 px-3 fs-6 ${isInProgress(selectedVisit.status) ? 'bg-success' : selectedVisit.status === 'Finished' ? 'bg-secondary' : selectedVisit.status === 'Cancelled' ? 'bg-danger' : 'bg-primary'}`} style={{ borderRadius: '4px' }}>
                                                {selectedVisit.status}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedVisit.status === 'Finished' && (
                                        <div className="mt-2 border-top pt-3 d-flex flex-column gap-3">
                                            <div>
                                                <span className="text-secondary small fw-bold d-block text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>Doctor's Description</span>
                                                <div className="p-3 bg-light rounded text-dark border-start border-success border-3" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                                                    {selectedVisit.description || <span className="text-muted fst-italic">No description provided.</span>}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-secondary small fw-bold d-block text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>Diagnosis</span>
                                                <div className="p-3 bg-light rounded text-dark border-start border-info border-3" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                                                    {selectedVisit.diagnosis || <span className="text-muted fst-italic">No diagnosis provided.</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid gap-2 mt-5 pt-2">
                                    {selectedVisit.status === 'Registered' && (
                                        <>
                                            <button
                                                className="btn text-white fw-bold py-2 text-uppercase"
                                                style={{ backgroundColor: flatlyDark, borderRadius: '4px' }}
                                                onClick={() => setShowStartModal(true)}
                                            >
                                                <i className="fa-solid fa-play me-2"></i> Start Visit
                                            </button>
                                            <button
                                                className="btn btn-outline-danger fw-bold py-2 text-uppercase"
                                                style={{ borderRadius: '4px', fontSize: '0.85rem' }}
                                                onClick={() => setShowCancelModal(true)}
                                            >
                                                <i className="fa-solid fa-xmark me-2"></i> Cancel Visit
                                            </button>
                                        </>
                                    )}

                                    {isInProgress(selectedVisit.status) && (
                                        <>
                                            <button
                                                className="btn btn-white text-dark border-2 fw-bold py-2 text-uppercase"
                                                style={{ backgroundColor: '#fff', border: `2px solid ${flatlyDark}`, borderRadius: '4px' }}
                                                onClick={() => onOrderExam(selectedVisit.id)}
                                            >
                                                <i className="fa-solid fa-microscope me-2"></i> Order New Exam
                                            </button>
                                            <button
                                                className="btn text-white fw-bold py-2 text-uppercase"
                                                style={{ backgroundColor: flatlyDark, borderRadius: '4px' }}
                                                onClick={handleFinishVisit}
                                            >
                                                <i className="fa-solid fa-check me-2"></i> Finish Visit
                                            </button>
                                            <button
                                                className="btn btn-outline-danger fw-bold py-2 text-uppercase mt-1"
                                                style={{ borderRadius: '4px', fontSize: '0.85rem' }}
                                                onClick={() => setShowCancelModal(true)}
                                            >
                                                <i className="fa-solid fa-xmark me-2"></i> Cancel Visit
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showStartModal && selectedVisit && (() => {
                const { date, time } = getFormattedDateTime(selectedVisit.appointmentDate);
                return (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                        <div className="bg-white p-4 rounded shadow-lg text-center border-0" style={{ maxWidth: '450px', width: '90%' }}>
                            <h4 className="fw-bold mb-3" style={{ color: flatlyDark }}>Start Visit?</h4>
                            <p className="text-muted mb-4">
                                Are you sure you want to start visit for <strong>{selectedVisit.patientName}</strong> ({date}, {time})?
                            </p>
                            <div className="d-flex gap-2 justify-content-center">
                                <button onClick={handleConfirmStartVisit} className="btn px-4 py-2 text-white fw-bold" style={{ backgroundColor: flatlyDark, borderRadius: '4px' }}>YES</button>
                                <button onClick={() => setShowStartModal(false)} className="btn btn-outline-secondary px-4 py-2 fw-bold" style={{ borderRadius: '4px' }}>CANCEL</button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {showCancelModal && selectedVisit && (() => {
                const { date, time } = getFormattedDateTime(selectedVisit.appointmentDate);
                return (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                        <div className="bg-white p-4 rounded shadow-lg text-center border-0" style={{ maxWidth: '450px', width: '90%' }}>
                            <h4 className="fw-bold mb-3 text-danger">Cancel Visit?</h4>
                            <p className="text-muted mb-4">
                                Are you sure you want to cancel visit for <strong>{selectedVisit.patientName}</strong> ({date}, {time})?
                            </p>
                            <div className="d-flex gap-2 justify-content-center">
                                <button onClick={handleConfirmCancelVisit} className="btn btn-danger px-4 py-2 fw-bold" style={{ borderRadius: '4px' }}>YES, CANCEL</button>
                                <button onClick={() => setShowCancelModal(false)} className="btn btn-outline-secondary px-4 py-2 fw-bold" style={{ borderRadius: '4px' }}>NO, KEEP</button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};
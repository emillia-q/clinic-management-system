import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { DateStripline } from "../../components/receptionist/DateStripline";

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
}

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const DoctorVisitsPage = ({ onOrderExam }: DoctorVisitsPageProps) => {
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
        setSelectedVisit(null);
    }, [fetchVisits]);

    const handleStartVisit = async () => {
        if (!selectedVisit) return;

        try {
            const doctorId = localStorage.getItem('userId');
            const payload = {
                appointmentDate: selectedVisit.appointmentDate,
                description: selectedVisit.description || "Started",
                doctorId: Number(doctorId),
                status: "In Progress"
            };
            await api.put(`/visits/${selectedVisit.id}`, payload);
        } catch {}

        setSelectedVisit({
            ...selectedVisit,
            status: 'In Progress'
        });

        setVisits(prevVisits => prevVisits.map(v =>
            v.id === selectedVisit.id ? { ...v, status: 'In Progress' } : v
        ));
    };

    const handleFinishVisit = async () => {
        if (!selectedVisit) return;

        try {
            await api.patch('/doctors/visits/finish', {
                visitId: selectedVisit.id,
                description: selectedVisit.description || "Finished",
                diagnosis: selectedVisit.diagnosis || ""
            });
        } catch {}

        setSelectedVisit({
            ...selectedVisit,
            status: 'Finished'
        });

        setVisits(prevVisits => prevVisits.map(v =>
            v.id === selectedVisit.id ? { ...v, status: 'Finished' } : v
        ));
    };

    const isInProgress = (status: string) => {
        const s = (status || "").toLowerCase();
        return s === 'in progress' || s === 'inprogress' || s === 'in_progress';
    };

    const filteredVisits = activeTab === 'All'
        ? visits
        : visits.filter(v => (v.status || "").toLowerCase() === activeTab.toLowerCase());

    return (
        <div className="container-fluid py-4 px-5">
            <div className="mb-5">
                <DateStripline
                    selectedDate={selectedDate}
                    onDateChange={(date: string) => {
                        setSelectedDate(date);
                        setSelectedVisit(null);
                    }}
                />
            </div>

            <div className="row g-4">
                <div className={selectedVisit ? "col-md-8" : "col-md-12"} style={{transition: 'all 0.3s ease'}}>
                    <header className="mb-4 text-start">
                        <h2 className="fw-bold text-dark">Doctor's Appointments</h2>
                    </header>

                    <ul className="nav nav-tabs mb-4 border-0">
                        {tabs.map(tab => (
                            <li className="nav-item" key={tab}>
                                <button
                                    className={`nav-link fw-bold ${activeTab === tab ? 'active text-dark border-dark border-top-0 border-start-0 border-end-0 border-4' : 'text-muted border-0'}`}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setSelectedVisit(null);
                                    }}
                                >
                                    {tab}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                        <div className="card-body p-0">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="table-light text-start">
                                <tr>
                                    <th className="ps-4">Time</th>
                                    <th>Patient</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody className="text-start">
                                {filteredVisits.map(v => (
                                    <tr
                                        key={v.id}
                                        onClick={() => setSelectedVisit(v)}
                                        style={{ cursor: 'pointer' }}
                                        className={selectedVisit?.id === v.id ? 'table-active' : ''}
                                    >
                                        <td className="fw-bold ps-4">
                                            {new Date(v.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                        <td>{v.patientName}</td>
                                        <td>
                                                <span className={`badge ${isInProgress(v.status) ? 'bg-success' : v.status === 'Finished' ? 'bg-secondary' : 'bg-primary'}`}>
                                                    {v.status}
                                                </span>
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
                        <div className="card border-0 shadow-lg rounded-3 overflow-hidden text-start">
                            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-start">
                                <div>
                                    <h4 className="fw-bold mb-0 text-primary">
                                        Visit: {selectedVisit.patientName}
                                    </h4>
                                    <p className="text-muted small">
                                        ({new Date(selectedVisit.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})
                                    </p>
                                </div>
                                <button className="btn-close" onClick={() => setSelectedVisit(null)}></button>
                            </div>

                            <div className="card-body px-4 pb-4">
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light">
                                        <span className="text-muted small fw-bold">VISIT ID</span>
                                        <span className="fw-bold">#{selectedVisit.id}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light">
                                        <span className="text-muted small fw-bold">PATIENT PESEL</span>
                                        <span className="fw-bold">{selectedVisit.socialSecurityNo || 'N/A'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light">
                                        <span className="text-muted small fw-bold">VISIT DATE</span>
                                        <span className="fw-bold">{new Date(selectedVisit.appointmentDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted small fw-bold">VISIT STATUS</span>
                                        <span className={`badge ${isInProgress(selectedVisit.status) ? 'bg-success' : selectedVisit.status === 'Finished' ? 'bg-secondary' : 'bg-primary'}`}>
                                            {selectedVisit.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="d-grid gap-2 pt-3">
                                    {selectedVisit.status === 'Registered' && (
                                        <button className="btn btn-primary btn-lg fw-bold py-3 shadow-sm" onClick={handleStartVisit}>
                                            <i className="fa-solid fa-play me-2"></i> Start Visit
                                        </button>
                                    )}

                                    {isInProgress(selectedVisit.status) && (
                                        <>
                                            <button
                                                className="btn btn-outline-dark btn-lg fw-bold border-2 py-3 mb-2"
                                                onClick={() => onOrderExam(selectedVisit.id)}
                                            >
                                                <i className="fa-solid fa-microscope me-2"></i> Order New Exam
                                            </button>
                                            <button className="btn btn-success btn-lg fw-bold py-3 shadow-sm" onClick={handleFinishVisit}>
                                                <i className="fa-solid fa-check me-2"></i> Finish Visit
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
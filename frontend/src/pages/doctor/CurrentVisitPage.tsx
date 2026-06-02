import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PatientDto } from "../../features/patients/types/patient.types.ts";

interface CurrentVisitPageProps {
    visitId: number;
    onBack: () => void;
    onOrderExam: () => void;
    onViewHistory: (patient: PatientDto) => void;
}

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1") + '/doctors'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const CurrentVisitPage = ({ visitId, onBack, onOrderExam, onViewHistory }: CurrentVisitPageProps) => {
    const [visitData, setVisitData] = useState({
        patientId: 0,
        patientName: "Loading...",
        socialSecurityNo: "",
        time: "",
        date: "",
        diagnosis: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [showBackModal, setShowBackModal] = useState(false);
    const [descriptionError, setDescriptionError] = useState<string | null>(null);

    const flatlyDark = "#2C3E50";
    const flatlyLight = "#ECF0F1";

    useEffect(() => {
        const fetchCurrentVisitDetails = async () => {
            try {
                const response = await api.get(`/visits/${visitId}`);
                const data = response.data;

                console.log("STRUKTURA WIZYTY Z API GRUPY", data);

                const visitDate = new Date(data.appointmentDate || data.date);
                const cleanDescription = (data.description === "New visit" || !data.description)
                    ? ""
                    : data.description;

                let extractedPatientId = 0;
                let extractedPatientName = "Patient";

                if (data.patient) {
                    extractedPatientId = data.patient.id || 0;
                    extractedPatientName = `${data.patient.firstName || ''} ${data.patient.lastName || ''}`.trim();
                } else if (data.patientDto) {
                    extractedPatientId = data.patientDto.id || 0;
                    extractedPatientName = `${data.patientDto.firstName || ''} ${data.patientDto.lastName || ''}`.trim();
                } else {
                    extractedPatientId = data.patientId || data.idPacjenta || 0;
                    extractedPatientName = data.patientName || "Unknown Patient";
                }

                setVisitData({
                    patientId: extractedPatientId,
                    patientName: extractedPatientName,
                    socialSecurityNo: data.socialSecurityNo || "",
                    time: visitDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    date: visitDate.toLocaleDateString('pl-PL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }),
                    diagnosis: data.diagnosis || "",
                    description: cleanDescription
                });
            } catch (error) {
                console.error("Error fetching current visit details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (visitId) {
            void fetchCurrentVisitDetails();
        }
    }, [visitId]);

    const handleViewOrdersClick = async () => {
        try {
            const response = await api.get('/patients');

            const patient = response.data.find(
                (p: PatientDto) =>
                    p.socialSecurityNo === visitData.socialSecurityNo
            );

            if (!patient) {
                alert("Patient not found.");
                return;
            }

            console.log("Patient for history:", patient);

            onViewHistory(patient);
        } catch (error) {
            console.error("Error loading patient history:", error);
            alert("Failed to load patient history.");
        }
    };

    const handleTryFinishVisit = () => {
        if (!visitData.description || visitData.description.trim() === "") {
            setDescriptionError("Description is required to finish the visit.");
            return;
        }
        setDescriptionError(null);
        setShowFinishModal(true);
    };

    const handleConfirmFinish = async () => {
        try {
            await api.patch('/visits/finish', {
                visitId: visitId,
                description: visitData.description,
                diagnosis: visitData.diagnosis || ""
            });
        } catch (error) {
            console.error("Error finishing visit via API:", error);
        }
        setShowFinishModal(false);
        onBack();
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white">
                <div className="spinner-border" style={{ color: flatlyDark }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-white font-sans position-relative">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 p-5 rounded shadow-sm position-relative" style={{ backgroundColor: flatlyLight }}>

                        <button
                            onClick={() => setShowBackModal(true)}
                            className="btn btn-link p-0 fs-3 text-decoration-none position-absolute start-0 top-0 mt-4 ms-4"
                            style={{ color: flatlyDark }}
                        >
                            &larr;
                        </button>

                        <div className="text-center mb-5 pt-2">
                            <h2 className="fw-bold mb-1" style={{ color: flatlyDark }}>
                                Visit: {visitData.patientName}
                            </h2>
                            <h5 className="text-muted fw-semibold">
                                ({visitData.date} {visitData.time})
                            </h5>
                        </div>

                        <div className="px-2 text-start">
                            <div className="mb-4">
                                <label className="form-label fw-bold fs-5" style={{ color: flatlyDark }}>
                                    Description <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    className={`form-control border-2 ${descriptionError ? 'is-invalid border-danger' : ''}`}
                                    rows={6}
                                    value={visitData.description}
                                    onChange={(e) => {
                                        setVisitData({...visitData, description: e.target.value});
                                        if (e.target.value.trim() !== "") {
                                            setDescriptionError(null);
                                        }
                                    }}
                                    style={{ borderRadius: '4px', resize: 'none', borderColor: descriptionError ? undefined : flatlyDark }}
                                />
                                {descriptionError && (
                                    <div className="invalid-feedback fw-bold mt-1">
                                        {descriptionError}
                                    </div>
                                )}
                            </div>

                            <div className="mb-5">
                                <label className="form-label fw-bold fs-5" style={{ color: flatlyDark }}>Diagnosis</label>
                                <textarea
                                    className="form-control border-2"
                                    rows={3}
                                    value={visitData.diagnosis}
                                    onChange={(e) => setVisitData({...visitData, diagnosis: e.target.value})}
                                    style={{ borderRadius: '4px', resize: 'none', borderColor: flatlyDark }}
                                />
                            </div>

                            <div className="d-grid gap-3">
                                <button
                                    onClick={handleViewOrdersClick}
                                    className="btn btn-white fw-bold py-2 text-uppercase text-dark border-2"
                                    style={{ backgroundColor: '#fff', border: `2px solid ${flatlyDark}`, borderRadius: '4px' }}
                                >
                                    <i className="fa-solid fa-magnifying-glass me-2"></i> View Orders
                                </button>

                                <button
                                    onClick={onOrderExam}
                                    className="btn fw-bold py-2 text-uppercase"
                                    style={{ backgroundColor: 'transparent', color: flatlyDark, border: `2px solid ${flatlyDark}`, borderRadius: '4px' }}
                                >
                                    Order a new exam
                                </button>

                                <button
                                    onClick={handleTryFinishVisit}
                                    className="btn py-3 fw-bold text-uppercase text-white"
                                    style={{ backgroundColor: flatlyDark, borderRadius: '4px', border: 'none' }}
                                >
                                    Finish Visit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showFinishModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="bg-white p-4 rounded shadow-lg text-center border-0" style={{ maxWidth: '400px', width: '90%' }}>
                        <h4 className="fw-bold mb-3" style={{ color: flatlyDark }}>Finish Visit?</h4>
                        <p className="text-muted mb-4">Are you sure you want to finish visit for <strong>{visitData.patientName}</strong> on <strong>{visitData.date}</strong>?</p>
                        <div className="d-flex gap-2 justify-content-center">
                            <button onClick={handleConfirmFinish} className="btn px-4 py-2 text-white fw-bold" style={{ backgroundColor: flatlyDark, borderRadius: '4px' }}>YES</button>
                            <button onClick={() => setShowFinishModal(false)} className="btn btn-outline-secondary px-4 py-2 fw-bold" style={{ borderRadius: '4px' }}>CANCEL</button>
                        </div>
                    </div>
                </div>
            )}

            {showBackModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="bg-white p-4 rounded shadow-lg text-center border-0" style={{ maxWidth: '400px', width: '90%' }}>
                        <h4 className="fw-bold mb-3" style={{ color: flatlyDark }}>Discard changes?</h4>
                        <p className="text-muted mb-4">All unsaved changes in diagnosis and description will be lost.</p>
                        <div className="d-flex gap-2 justify-content-center">
                            <button onClick={onBack} className="btn px-4 py-2 text-white fw-bold" style={{ backgroundColor: flatlyDark, borderRadius: '4px' }}>YES, DISCARD</button>
                            <button onClick={() => setShowBackModal(false)} className="btn btn-outline-secondary px-4 py-2 fw-bold" style={{ borderRadius: '4px' }}>NO, STAY</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentVisitPage;
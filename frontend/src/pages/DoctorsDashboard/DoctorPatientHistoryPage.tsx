import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {format} from "date-fns";
import type {PatientDto} from "../../features/patients/types/patient.types.ts";

interface VisitHistoryItemDto {
    id: number;
    date: string;
    type: string;
}

interface PatientHistoryDto {
    visits: VisitHistoryItemDto[];
    physicalExams: VisitHistoryItemDto[];
    labExams: VisitHistoryItemDto[];
}

interface DoctorPatientHistoryPageProps {
    patient: PatientDto;
    onBack: () => void;
}

const formatHistoryDate = (date: string) => format(new Date(date), "dd.MM.yyyy");

const HistoryListSection = ({title, items}: { title: string; items: VisitHistoryItemDto[] }) => {
    return (
        <div className="mb-3">
            <h6 className="fw-bold mb-2">{title}</h6>
            <div className="border" style={{maxHeight: "150px", overflowY: "auto"}}>
                {items.length === 0 ? (
                    <div className="px-3 py-2 text-muted">No results found</div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="d-flex justify-content-between align-items-center border-bottom px-3 py-2"
                        >
                            <span>{formatHistoryDate(item.date)}</span>
                            <span className="text-center flex-grow-1">{item.type}</span>
                            <i className="fa-solid fa-chevron-down"/>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export const DoctorPatientHistoryPage = ({patient, onBack}: DoctorPatientHistoryPageProps) => {
    const [history, setHistory] = useState<PatientHistoryDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [historyUnavailable, setHistoryUnavailable] = useState(false);

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: "http://localhost:8080/api/v1/doctors"
        });
        instance.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        return instance;
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setHistoryUnavailable(false);
            try {
                const response = await api.get(`/patients/${patient.id}/history`);
                setHistory(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 204) {
                    setHistory({visits: [], physicalExams: [], labExams: []});
                } else if (axios.isAxiosError(error) && error.response?.status === 404) {
                    // Endpoint unavailable or unsupported in current backend build.
                    setHistoryUnavailable(true);
                    setHistory({visits: [], physicalExams: [], labExams: []});
                } else {
                    console.error("Error fetching patient history:", error);
                    setHistory({visits: [], physicalExams: [], labExams: []});
                }
            } finally {
                setIsLoading(false);
            }
        };

        void fetchHistory();
    }, [api, patient.id]);

    const handleOrderNewExam = () => {
        // TODO: Attach logic for creating a new exam order.
    };

    return (
        <div className="container py-4">
            <div className="mx-auto bg-white shadow-sm p-4" style={{maxWidth: "780px"}}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <button className="btn btn-link text-dark p-0" onClick={onBack}>
                        <i className="fa-solid fa-arrow-left fs-4"/>
                    </button>
                    <h3 className="h4 mb-0 fw-bold text-center flex-grow-1">
                        Visit History: {patient.firstName} {patient.lastName}
                    </h3>
                    <div style={{width: "28px"}}/>
                </div>

                <div className="bg-light px-3 py-2 mb-3 fw-bold">Previous Appointments</div>

                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-dark" onClick={handleOrderNewExam}>Order a New Exam</button>
                </div>

                {historyUnavailable && (
                    <div className="alert alert-light border py-2 px-3 mb-3">
                        No results found (history endpoint unavailable).
                    </div>
                )}

                {isLoading ? (
                    <div className="text-muted">Loading history...</div>
                ) : (
                    <>
                        <HistoryListSection title="Visits" items={history?.visits ?? []}/>
                        <HistoryListSection title="Physical Exams" items={history?.physicalExams ?? []}/>
                        <HistoryListSection title="Laboratory Exams" items={history?.labExams ?? []}/>
                    </>
                )}
            </div>
        </div>
    );
};

import {useEffect, useState} from 'react';
import type {PatientDto, PatientUpcomingVisitDto} from "../../features/patients/types/patient.types.ts";
import {PatientList} from "../../features/patients/ui/PatientList.tsx";
import {PatientDetailsForDoctor} from "../../features/doctors/ui/PatientDetailsForDoctor.tsx";
import {SearchPatients} from "../../features/patients/ui/SearchPatients.tsx";
import {DoctorPatientHistoryPage} from "./DoctorPatientHistoryPage.tsx";
import axios from 'axios';
import type {InvalidParametersErrorDetails} from "../../features/errors/types/ErrorType.ts";
import {filterPatientsByQuery} from "../../features/patients/utils/filterPatientsByQuery.ts";
import {DASHBOARD_PAGE_CLASS} from "../../shared/ui/styles";

export const DoctorPatientsPage = () => {
    const [allPatients, setAllPatients] = useState<PatientDto[]>([]);
    const [patients, setPatients] = useState<PatientDto[]>([]);
    const [appliedSearchQuery, setAppliedSearchQuery] = useState<string | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<PatientUpcomingVisitDto | null>(null);
    const [historyPatient, setHistoryPatient] = useState<PatientDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const api = axios.create({
        baseURL: (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1") + '/doctors'
    });
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const fetchPatients = async (searchQuery = appliedSearchQuery) => {
        setIsLoading(true);
        try {
            const response = await api.get('/patients');
            setAllPatients(response.data);
            setPatients(filterPatientsByQuery(response.data, searchQuery));
        } catch (error) {
            const errorDetails = (error as {response: {data: InvalidParametersErrorDetails}}).response.data;
            let fullErrorMessage: string = "";
            if (errorDetails.errors) {
                const fieldErrors = Object.entries(errorDetails.errors)
                    .map(([field, reason]) => `• ${field}: ${reason}`)
                    .join('\n');
                fullErrorMessage += `Details:\n${fieldErrors}`;
            } else {
                fullErrorMessage = errorDetails.message;
            }
            alert("Failed to fetch patients!\n" + fullErrorMessage);
            console.error("Connection error:", errorDetails);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (query: string | null) => {
        setAppliedSearchQuery(query);
        setPatients(filterPatientsByQuery(allPatients, query));
    };

    useEffect(() => {
        void fetchPatients(null);
    }, []);

    const handleSelectPatient = async (patientFromList: PatientDto) => {
        try {
            const response = await api.get(`/patients/${patientFromList.id}`);
            setSelectedPatient(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    if (historyPatient) {
        return (
            <DoctorPatientHistoryPage
                patient={historyPatient}
                onBack={() => setHistoryPatient(null)}
            />
        );
    }

    return (
        <div className={DASHBOARD_PAGE_CLASS}>
            <div className="row mb-4 align-items-end">
                <SearchPatients onSearch={handleSearch} />
            </div>

            <div className="row g-4">
                <div className={(selectedPatient) ? "col-md-8" : "col-md-12"}
                     style={{transition: 'all 0.3s ease'}}>
                    <PatientList
                        patients={patients}
                        isLoading={isLoading}
                        onSelectPatient={handleSelectPatient}
                        selectedPatientId={selectedPatient?.patient.id}
                        showDOBColl={false}
                    />
                </div>

                <div className="col-md-4">
                    {selectedPatient && (
                        <PatientDetailsForDoctor
                            patientVisit={selectedPatient}
                            onClose={() => setSelectedPatient(null)}
                            onRefresh={() => fetchPatients()}
                            onViewHistory={() => setHistoryPatient(selectedPatient.patient)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

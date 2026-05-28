import {useEffect, useState} from 'react';
import type {PatientDto, PatientUpcomingVisitDto} from "../../features/patients/types/patient.types.ts";
import {PatientList} from "../../features/patients/ui/PatientList.tsx";
import {PatientDetailsForDoctor} from "../../features/doctors/ui/PatientDetailsForDoctor.tsx";
import {SearchPatients, type SearchPatientsData} from "../../features/patients/ui/SearchPatients.tsx";
import {DoctorPatientHistoryPage} from "./DoctorPatientHistoryPage.tsx";
import axios from 'axios';
import type {InvalidParametersErrorDetails} from "../../features/errors/types/ErrorType.ts";


export const DoctorPatientsPage = () => {
    const [patients, setPatients] = useState<PatientDto[]>([]);
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

    const fetchPatients = async (searchParams?: SearchPatientsData | null) => {
        setIsLoading(true);
        try {
            const response = await api.get('/patients', {params: searchParams});
            setPatients(response.data);
        } catch (error) {
            const errorDetails = error.response.data as InvalidParametersErrorDetails;
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

    const setSearchQueryReFetch = async (params: SearchPatientsData | null) => {
        await fetchPatients(params);
    }

    useEffect(() => {
        void fetchPatients();
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
        <div className="container-fluid py-4 px-5">
            <div className="row mb-4 align-items-end">
                <SearchPatients
                    onSearch={setSearchQueryReFetch}
                />
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
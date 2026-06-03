import { useEffect, useState } from 'react';
import type { PatientDto, PatientUpcomingVisitDto } from "../../features/patients/types/patient.types.ts";
import { PatientList } from "../../features/patients/ui/PatientList.tsx";
import { PatientDetailsForDoctor } from "../../features/doctors/ui/PatientDetailsForDoctor.tsx";
import { SearchPatients } from "../../features/patients/ui/SearchPatients.tsx";
import { DoctorPatientHistoryPage } from "./PatientHistoryPage";
import axios from 'axios';
import type { InvalidParametersErrorDetails } from "../../features/errors/types/ErrorType.ts";
import { DASHBOARD_PAGE_CLASS, SPLIT_PANEL_TRANSITION_STYLE } from "../../shared/ui/styles";

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

    const performFiltering = (allData: PatientDto[], query: string | null) => {
        if (!query || query.trim() === "") {
            return allData;
        }

        const lowerQuery = query.toLowerCase().trim();

        return allData.filter(patient => {
            const firstName = (patient.firstName || "").toLowerCase();
            const lastName = (patient.lastName || "").toLowerCase();
            const pesel = (patient.socialSecurityNo || "").toLowerCase();
            const fullName = `${firstName} ${lastName}`;
            const reversedFullName = `${lastName} ${firstName}`;

            return (
                firstName.includes(lowerQuery) ||
                lastName.includes(lowerQuery) ||
                pesel.includes(lowerQuery) ||
                fullName.includes(lowerQuery) ||
                reversedFullName.includes(lowerQuery)
            );
        });
    };

    const fetchPatients = async (searchQuery = appliedSearchQuery) => {
        setIsLoading(true);
        try {
            const response = await api.get('/patients');
            setAllPatients(response.data);
            setPatients(performFiltering(response.data, searchQuery));
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
        setPatients(performFiltering(allPatients, query));
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

    const isSearchEmpty = !appliedSearchQuery || appliedSearchQuery.trim() === "";

    return (
        <div className={DASHBOARD_PAGE_CLASS}>
            <style>{`
                .custom-search-container .text-danger,
                .custom-search-container .fa-xmark,
                .custom-search-container button {
                    display: ${isSearchEmpty ? 'none !important' : 'inline-block !important'};
                }
            `}</style>

            <div className="row mb-4 align-items-end custom-search-container">
                <SearchPatients onSearch={handleSearch} />
            </div>

            <div className="row g-4">
                <div className={(selectedPatient) ? "col-md-8" : "col-md-12"}
                     style={SPLIT_PANEL_TRANSITION_STYLE}>
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
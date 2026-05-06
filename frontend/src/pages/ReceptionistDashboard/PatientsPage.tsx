import {useEffect, useState} from 'react';
import type {PatientDto} from "../../features/patients/types/patient.types.ts";
import {PatientSearchAdd} from "../../components/receptionist/PatientSearchAdd.tsx";
import {PatientList} from "../../features/patients/ui/PatientList.tsx";
import {PatientDetails} from "../../components/receptionist/PatientDetails";
import {AddPatientPanel} from "../../components/receptionist/AddPatientPanel.tsx";
import type {SearchPatientsData} from "../../features/patients/ui/SearchPatients.tsx";
import axios from "axios";
import type {InvalidParametersErrorDetails} from "../../features/errors/types/ErrorType.ts";

interface PatientsPageProps {
    onScheduleVisit: (patientId: number) => void;
}

export const PatientsPage = ({onScheduleVisit}: PatientsPageProps) => {
    const [patients, setPatients] = useState<PatientDto[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/v1/patients'
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
            const response = await api.get('', {params: searchParams});
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

    useEffect(() => {
        void fetchPatients();
    }, []);

    const setSearchQueryReFetch = async (params: SearchPatientsData | null) => {
        await fetchPatients(params);
    }

    const handleOpenAddPanel = () => {
        setSelectedPatient(null);
        setIsAddingNew(true);
    };

    const handleSelectPatient = async (patientFromList: PatientDto) => {
        setIsAddingNew(false);
        try {
            const response = await api.get(`/${patientFromList.id}`);
            setSelectedPatient(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    return (
        <div className="container-fluid py-4 px-5">
            <PatientSearchAdd
                onSearch={setSearchQueryReFetch}
                onAddPatientClick={handleOpenAddPanel}
            />

            <div className="row g-4">
                <div className={(selectedPatient || isAddingNew) ? "col-md-8" : "col-md-12"}
                     style={{transition: 'all 0.3s ease'}}>
                    <PatientList
                        patients={patients}
                        isLoading={isLoading}
                        onSelectPatient={handleSelectPatient}
                        selectedPatientId={selectedPatient?.id}
                    />
                </div>

                <div className="col-md-4">
                    {selectedPatient && (
                        <PatientDetails
                            patient={selectedPatient}
                            onClose={() => setSelectedPatient(null)}
                            onRefresh={() => fetchPatients()}
                            onSchedule={onScheduleVisit}
                        />
                    )}

                    {isAddingNew && (
                        <AddPatientPanel
                            onClose={() => setIsAddingNew(false)}
                            onRefresh={() => fetchPatients()}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
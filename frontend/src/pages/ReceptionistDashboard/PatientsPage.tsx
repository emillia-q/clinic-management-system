import {useEffect, useState} from 'react';
import type {PatientDto} from "../../features/patients/types/patient.types.ts";
import {PatientSearchAdd} from "../../components/receptionist/PatientSearchAdd.tsx";
import {PatientList} from "../../features/patients/ui/PatientList.tsx";
import {PatientDetails} from "../../components/receptionist/PatientDetails";
import {AddPatientPanel} from "../../components/receptionist/AddPatientPanel.tsx";
import type {InvalidParametersErrorDetails} from "../../features/errors/types/ErrorType.ts";
import {patientsApi} from "../../features/patients/api/patientsApi.ts";
import {filterPatientsByQuery} from "../../features/patients/utils/filterPatientsByQuery.ts";

interface PatientsPageProps {
    onScheduleVisit: (patientId: number) => void;
}

export const PatientsPage = ({onScheduleVisit}: PatientsPageProps) => {
    const [allPatients, setAllPatients] = useState<PatientDto[]>([]);
    const [patients, setPatients] = useState<PatientDto[]>([]);
    const [appliedSearchQuery, setAppliedSearchQuery] = useState<string | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPatients = async (searchQuery = appliedSearchQuery) => {
        setIsLoading(true);
        try {
            const response = await patientsApi.get('');
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

    useEffect(() => {
        void fetchPatients(null);
    }, []);

    const handleSearch = (query: string | null) => {
        setAppliedSearchQuery(query);
        setPatients(filterPatientsByQuery(allPatients, query));
    };

    const handleOpenAddPanel = () => {
        setSelectedPatient(null);
        setIsAddingNew(true);
    };

    const handleSelectPatient = async (patientFromList: PatientDto) => {
        setIsAddingNew(false);
        try {
            const response = await patientsApi.get(`/${patientFromList.id}`);
            setSelectedPatient(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    const refreshAfterEdit = async () => {
        await fetchPatients();
        if (selectedPatient) {
            try {
                const response = await patientsApi.get(`/${selectedPatient.id}`);
                setSelectedPatient(response.data);
            } catch (error) {
                console.error("Error refreshing patient details:", error);
            }
        }
    };

    return (
        <div className="container-fluid py-4 px-5">
            <PatientSearchAdd
                onSearch={handleSearch}
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
                            onRefresh={refreshAfterEdit}
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

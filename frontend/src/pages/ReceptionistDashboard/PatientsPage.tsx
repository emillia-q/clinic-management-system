import {useEffect, useState} from 'react';
import type {PatientDto} from "../../services/types";
import {PatientSearch} from "../../components/receptionist/PatientSearch";
import {PatientList} from "../../components/receptionist/PatientList";
import {PatientDetails} from "../../components/receptionist/PatientDetails";
import {AddPatientPanel} from "../../components/receptionist/AddPatientPanel.tsx";

interface PatientsPageProps {
    onScheduleVisit: (patientId: number) => void;
}

export const PatientsPage = ({onScheduleVisit}: PatientsPageProps) => {
    const [patients, setPatients] = useState<PatientDto[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchPatients = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/v1/patients");
            if (response.ok) {
                const data = await response.json();
                setPatients(data);
            }
        } catch (error) {
            console.error("Connection error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        const pesel = patient.socialSecurityNo.toLowerCase();

        return fullName.includes(query) || pesel.includes(query);
    });

    const handleOpenAddPanel = () => {
        setSelectedPatient(null);
        setIsAddingNew(true);
    };

    const handleSelectPatient = async (patientFromList: PatientDto) => {
        setIsAddingNew(false);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/patients/${patientFromList.id}`);
            if (response.ok) {
                const fullPatientData = await response.json();
                setSelectedPatient(fullPatientData);
            } else {
                console.error("Failed to fetch patient details");
            }
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    return (
        <div className="container-fluid py-4 px-5">
            <PatientSearch
                onSearch={setSearchQuery}
                onAddPatientClick={handleOpenAddPanel}
            />

            <div className="row g-4">
                <div className={(selectedPatient || isAddingNew) ? "col-md-8" : "col-md-12"}
                     style={{transition: 'all 0.3s ease'}}>
                    <PatientList
                        patients={filteredPatients}
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
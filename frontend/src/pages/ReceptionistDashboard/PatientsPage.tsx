import {useEffect, useState} from 'react';
import type {PatientDto} from "../../services/types";
import {PatientSearch} from "../../components/receptionist/PatientSearch";
import {PatientList} from "../../components/receptionist/PatientList";
import {PatientDetails} from "../../components/receptionist/PatientDetails";
import {AddPatientPanel} from "../../components/receptionist/AddPatientPanel.tsx";

export const PatientsPage = () => {
    const [patients, setPatients] = useState<PatientDto[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchPatients = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/patient");
            if (response.ok) {
                const data = await response.json();
                setPatients(data);
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    useEffect(() => {
        void fetchPatients();
    }, []);

    const handleOpenAddPanel = () => {
        setSelectedPatient(null);
        setIsAddingNew(true);
    };

    const handleSelectPatient = (patient: PatientDto) => {
        setIsAddingNew(false);
        setSelectedPatient(patient);
    };

    return (
        <div className="container-fluid py-4">
            <PatientSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddPatientClick={handleOpenAddPanel}
            />

            <div className="row g-4">
                <div className={(selectedPatient || isAddingNew) ? "col-md-8" : "col-md-12"}>
                    <PatientList
                        patients={patients}
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
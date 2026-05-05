import {useEffect, useState} from 'react';
import type {PatientDto, PatientUpcomingVisitDto} from "../../features/patients/types/patient.types.ts";
import {PatientList} from "../../components/receptionist/PatientList";
import {PatientDetailsForDoctor} from "../../features/doctors/ui/PatientDetailsForDoctor.tsx";
import {SearchPatients, type SearchPatientsData} from "../../features/patients/ui/SearchPatients.tsx";
import axios from 'axios';


export const DoctorPatientsPage = () => {
    const [patients, setPatients] = useState<PatientDto[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientUpcomingVisitDto | null>(null);
    const [searchQuery, setSearchQuery] = useState<SearchPatientsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/v1/doctors'
    });
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const fetchPatients = async (searchParams?: SearchPatientsData) => {
        setIsLoading(true);
        try {
            const response = await api.get('/patients', {params: searchParams});
            setPatients(response.data);
        } catch (error) {
            console.error("Connection error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const setSearchQueryReFetch = async (params: SearchPatientsData) => {
        setSearchQuery(params);
        await fetchPatients(params);
    }

    useEffect(() => {
        void fetchPatients(searchQuery);
    }, []);

    const handleSelectPatient = async (patientFromList: PatientDto) => {
        try {
            const response = await api.get(`/patients/${patientFromList.id}`);
            console.log(response.data)

            setSelectedPatient(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    return (
        <div className="container-fluid py-4 px-5">
            <SearchPatients
                onSearch={setSearchQueryReFetch}
                //doctor can not add a patient however the `PatientSearch` component requires this and always shows this button
                onAddPatientClick={null}
            />

            <div className="row g-4">
                <div className={(selectedPatient) ? "col-md-8" : "col-md-12"}
                     style={{transition: 'all 0.3s ease'}}>
                    <PatientList
                        patients={patients}
                        isLoading={isLoading}
                        onSelectPatient={handleSelectPatient}
                        selectedPatientId={selectedPatient?.patient.id}
                    />
                </div>

                <div className="col-md-4">
                    {selectedPatient && (
                        <PatientDetailsForDoctor
                            patientVisit={selectedPatient}
                            onClose={() => setSelectedPatient(null)}
                            onRefresh={() => fetchPatients()}
                            //TODO: when the `ViewHistory` panel is done connect it
                            onViewHistory={null}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
import React, {useState, useEffect} from 'react';
import type {PatientGeneralDto} from "../../features/patients/types/patient.types.ts";
import type {StaffListDto} from "../../features/staff/types/staff.types.ts";
import type {VisitDto} from "../../features/visits/types/visit.types.ts";
import {parseFetchError} from "../../features/errors/utils/parseFetchError.ts";
import {formatDoctorName, stripDoctorPrefix} from "../../features/staff/utils/formatDoctorName.ts";

interface NewVisitPageProps {
    initialPatientId: number | null;
    visitToEdit?: VisitDto | null;
    preferredDate?: string;
    onBack: () => void;
}

export const NewVisitPage = ({onBack, initialPatientId, visitToEdit, preferredDate}: NewVisitPageProps) => {
    const isEditMode = !!visitToEdit;

    const initialDate = visitToEdit
        ? visitToEdit.appointmentDate.split('T')[0]
        : (preferredDate || "");
    const initialTime = visitToEdit ? visitToEdit.appointmentDate.split('T')[1].substring(0, 5) : "";

    const [patients, setPatients] = useState<PatientGeneralDto[]>([]);
    const [doctors, setDoctors] = useState<StaffListDto[]>([]);
    const [allVisits, setAllVisits] = useState<VisitDto[]>([]);

    const [selectedPatientId, setSelectedPatientId] = useState(
        visitToEdit?.patientId?.toString() ?? (initialPatientId?.toString() || "")
    );

    const [selectedDoctorId, setSelectedDoctorId] = useState(
        visitToEdit?.doctorId?.toString() ?? ""
    );
    const [visitDate, setVisitDate] = useState(initialDate);
    const [visitTime, setVisitTime] = useState(initialTime);
    const [isLoading, setIsLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const today = new Date().toISOString().split('T')[0];

    // ZMODYFIKOWANA FUNKCJA: Filtruje zajęte sloty per lekarz i dzień
    const generateTimeSlots = () => {
        const slots: string[] = [];

        // 1. Generowanie pełnej puli godzin działania kliniki
        for (let hour = 7; hour <= 19; hour++) {
            for (const min of ["00", "15", "30", "45"]) {
                if (hour === 19 && min !== "00") break;
                const h = hour.toString().padStart(2, '0');
                slots.push(`${h}:${min}`);
            }
        }

        // 2. Jeśli nie wybrano lekarza lub daty, zwracamy wszystkie godziny
        if (!selectedDoctorId || !visitDate) {
            return slots;
        }

        // Znajdujemy obiekt wybranego lekarza w stanie "doctors", żeby mieć dostęp do jego imienia i nazwiska
        const currentSelectedDoctor = doctors.find(d => d.id.toString() === selectedDoctorId.toString());

        // 3. Szukamy godzin, które u tego lekarza w tym dniu są już zajęte
        const occupiedTimes = allVisits
            .filter(v => {
                if (!v.appointmentDate) return false;

                const vDate = v.appointmentDate.split('T')[0];
                const isSameDate = vDate === visitDate;

                const vDocId = v.doctorId;

                // PORÓWNANIE PO ID (konwertujemy obie strony na Number dla bezpieczeństwa)
                let isSameDoctor = false;
                if (vDocId && selectedDoctorId) {
                    isSameDoctor = Number(vDocId) === Number(selectedDoctorId);
                }

                if (!isSameDoctor && v.doctorName && currentSelectedDoctor) {
                    const visitDocNameClean = stripDoctorPrefix(v.doctorName).toLowerCase();
                    const selectedDocNameClean = `${currentSelectedDoctor.firstName} ${currentSelectedDoctor.lastName}`.trim().toLowerCase();
                    isSameDoctor = visitDocNameClean === selectedDocNameClean;
                }

                // Zabezpieczenie statusu (odsiewamy wizyty anulowane i odwołane)
                const vStatus = (v.status || "").toLowerCase();
                const isNotCancelled = vStatus !== 'cancelled' && vStatus !== 'canceled';

                // Tryb edycji: nie blokujemy godziny tej wizyty, którą aktualnie modyfikujemy
                const isNotCurrentVisit = visitToEdit ? v.id !== visitToEdit.id : true;

                return isSameDate && isSameDoctor && isNotCancelled && isNotCurrentVisit;
            })
            .map(v => v.appointmentDate.split('T')[1].substring(0, 5));

        // 4. Zwracamy wyłącznie wolne terminy
        return slots.filter(slot => !occupiedTimes.includes(slot));
    };
    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers: HeadersInit = {
                    "Content-Type": "application/json"
                };

                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

                // Dodaliśmy fetch `${baseUrl}/visits` do pobierania bazy wizyt
                const [patRes, docRes, visitsRes] = await Promise.all([
                    fetch(`${baseUrl}/patients`, { headers }),
                    fetch(`${baseUrl}/staff?type=Doctor`, { headers }),
                    fetch(`${baseUrl}/visits`, { headers })
                ]);

                if (patRes.ok) {
                    const patientsData: PatientGeneralDto[] = await patRes.json();
                    setPatients(patientsData);

                    if (isEditMode && visitToEdit) {
                        if (visitToEdit.patientId) {
                            setSelectedPatientId(visitToEdit.patientId.toString());
                        } else {
                            const foundPatient = patientsData.find(p =>
                                (visitToEdit.socialSecurityNo && p.socialSecurityNo === visitToEdit.socialSecurityNo) ||
                                (visitToEdit.patientName && `${p.firstName} ${p.lastName}` === visitToEdit.patientName)
                            );
                            if (foundPatient) {
                                setSelectedPatientId(foundPatient.id.toString());
                            }
                        }
                    } else if (initialPatientId && !isEditMode) {
                        const exists = patientsData.find(p => p.id === initialPatientId);
                        if (exists) setSelectedPatientId(initialPatientId.toString());
                    }
                }

                if (docRes.ok) {
                    const doctorsData: StaffListDto[] = await docRes.json();
                    setDoctors(doctorsData);

                    if (isEditMode && visitToEdit) {
                        if (visitToEdit.doctorId) {
                            setSelectedDoctorId(visitToEdit.doctorId.toString());
                        } else if (visitToEdit.doctorName) {
                            const cleanDoctorName = stripDoctorPrefix(visitToEdit.doctorName);
                            const foundDoctor = doctorsData.find(d =>
                                `${d.firstName} ${d.lastName}` === cleanDoctorName ||
                                `${d.lastName} ${d.firstName}` === cleanDoctorName
                            );
                            if (foundDoctor) {
                                setSelectedDoctorId(foundDoctor.id.toString());
                            }
                        }
                    }
                }

                if (visitsRes.ok) {
                    const visitsData: VisitDto[] = await visitsRes.json();
                    setAllVisits(visitsData);
                }
            } catch (err) {
                console.error("Connection error:", err);
            }
        };
        void loadData();
    }, [initialPatientId, isEditMode, visitToEdit]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveError(null);

        if (!selectedDoctorId || !selectedPatientId) {
            setSaveError("Please select a patient and a doctor.");
            return;
        }

        setIsLoading(true);

        const appointmentDate = `${visitDate}T${visitTime}:00`;
        const createPayload = {
            patientId: Number(selectedPatientId),
            doctorId: Number(selectedDoctorId),
            receptionistId: 3,
            appointmentDate,
            description: "New visit"
        };
        const updatePayload = {
            appointmentDate,
            description: visitToEdit?.description || "Updated visit",
            doctorId: Number(selectedDoctorId),
            status: visitToEdit?.status ?? "Registered"
        };

        try {
            const token = localStorage.getItem("token");
            const headers: HeadersInit = { "Content-Type": "application/json" };
            if (token) { headers["Authorization"] = `Bearer ${token}`; }

            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
            const url = isEditMode ? `${baseUrl}/visits/${visitToEdit!.id}` : `${baseUrl}/visits`;
            const method = isEditMode ? "PUT" : "POST";
            const body = isEditMode ? updatePayload : createPayload;

            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(body)
            });

            if (response.ok) {
                onBack();
            } else {
                setSaveError(await parseFetchError(response));
            }
        } catch {
            setSaveError("Could not connect to the server. Check that the backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center py-5" lang="en">
            <div className="card border-0 shadow-sm" style={{maxWidth: '600px', width: '100%'}}>
                <div className="card-body p-5">
                    <div className="d-flex align-items-center mb-5">
                        <button className="btn btn-link text-dark p-0 me-3" onClick={onBack}>
                            <i className="fa-solid fa-arrow-left fs-3"></i>
                        </button>
                        <h2 className="fw-bold mb-0">
                            {isEditMode ? "Edit Scheduled Visit" : "Schedule a New Visit"}
                        </h2>
                    </div>

                    <form onSubmit={handleSave}>
                        {saveError && (
                            <div className="alert alert-danger py-2 small mb-4" role="alert">
                                {saveError}
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="form-label fw-bold text-secondary small">Select Patient</label>
                            <select
                                className="form-select form-select-lg border-2"
                                value={selectedPatientId}
                                onChange={(e) => setSelectedPatientId(e.target.value)}
                                required
                                disabled={isEditMode}
                            >
                                <option value="">Choose...</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.firstName} {p.lastName} - {p.socialSecurityNo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold text-secondary small">Select Doctor</label>
                            <select
                                className="form-select form-select-lg border-2"
                                value={selectedDoctorId}
                                onChange={(e) => {
                                    setSelectedDoctorId(e.target.value);
                                    setVisitTime("");
                                    setSaveError(null);
                                }}
                                required
                            >
                                <option value="">Choose...</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>{formatDoctorName(d.firstName, d.lastName)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary small">Visit Date</label>
                                <input
                                    type="date"
                                    className="form-control form-control-lg border-2"
                                    value={visitDate}
                                    min={today}
                                    onChange={(e) => {
                                        setVisitDate(e.target.value);
                                        setVisitTime("");
                                        setSaveError(null);
                                    }}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary small">Visit Time</label>
                                <select
                                    className="form-select form-select-lg border-2"
                                    value={visitTime}
                                    onChange={(e) => setVisitTime(e.target.value)}
                                    required
                                >
                                    <option value="">Select...</option>
                                    {generateTimeSlots().map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="text-center mt-5 pt-4">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow"
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : (isEditMode ? "Update Visit" : "Save Visit")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
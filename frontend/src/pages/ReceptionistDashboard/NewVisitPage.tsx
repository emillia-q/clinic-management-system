import React, {useState, useEffect} from 'react';
import type {PatientGeneralDto} from "../../features/patients/types/patient.types.ts";
import type {StaffListDto} from "../../features/staff/types/staff.types.ts";

interface NewVisitPageProps {
    initialPatientId: number | null;
    onBack: () => void;
}

export const NewVisitPage = ({onBack, initialPatientId}: NewVisitPageProps) => {
    const [patients, setPatients] = useState<PatientGeneralDto[]>([]);
    const [doctors, setDoctors] = useState<StaffListDto[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId?.toString() || "");
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [visitDate, setVisitDate] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 7; hour <= 19; hour++) {
            for (let min of ["00", "15", "30", "45"]) {
                if (hour === 19 && min !== "00") break;
                const h = hour.toString().padStart(2, '0');
                slots.push(`${h}:${min}`);
            }
        }
        return slots;
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem('token');

                const [patRes, docRes] = await Promise.all([
                    fetch("http://localhost:8080/api/v1/patients", {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch("http://localhost:8080/api/v1/staff?type=Doctor", {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                if (patRes.ok) {
                    const patientsData: PatientGeneralDto[] = await patRes.json();
                    setPatients(patientsData);
                    if (initialPatientId) {
                        const exists = patientsData.find(p => p.id === initialPatientId);
                        if (exists) setSelectedPatientId(initialPatientId.toString());
                    }
                }

                if (docRes.ok) {
                    const doctorsData: StaffListDto[] = await docRes.json();
                    setDoctors(doctorsData);
                }
            } catch (err) {
                console.error("Connection error:", err);
            }
        };
        void loadData();
    }, [initialPatientId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            patientId: Number(selectedPatientId),
            doctorId: Number(selectedDoctorId),
            receptionistId: 3,
            appointmentDate: `${visitDate}T${visitTime}:00`,
            description: "New visit"
        };

        try {
            const token = localStorage.getItem('token');

            const response = await fetch("http://localhost:8080/api/v1/visits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Visit scheduled successfully!");
                onBack();
            } else {
                const err = await response.text();
                alert("Error: " + err);
            }
        } catch (error) {
            alert("Network error. Is the backend running?");
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
                        <h2 className="fw-bold mb-0">Schedule a New Visit</h2>
                    </div>

                    <form onSubmit={handleSave}>
                        <div className="mb-4">
                            <label className="form-label fw-bold text-secondary small">Select Patient</label>
                            <select
                                className="form-select form-select-lg border-2"
                                value={selectedPatientId}
                                onChange={(e) => setSelectedPatientId(e.target.value)}
                                required
                            >
                                <option value="">Choose...</option>
                                {patients.map(p => (
                                    <option key={p.id}
                                            value={p.id}>{p.firstName} {p.lastName} - {p.socialSecurityNo}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold text-secondary small">Select Doctor</label>
                            <select
                                className="form-select form-select-lg border-2"
                                value={selectedDoctorId}
                                onChange={(e) => setSelectedDoctorId(e.target.value)}
                                required
                            >
                                <option value="">Choose...</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>
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
                                    onChange={(e) => setVisitDate(e.target.value)}
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
                                {isLoading ? "Processing..." : "Save Visit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
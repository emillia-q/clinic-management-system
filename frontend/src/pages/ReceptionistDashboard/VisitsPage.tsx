import {useEffect, useState, useCallback} from 'react';
import type {VisitDto} from "../../features/visits/types/visit.types.ts";
import {VisitTabs} from "../../components/receptionist/VisitTabs";
import {VisitList} from "../../components/receptionist/VisitList";
import {DateStripline} from "../../components/receptionist/DateStripline";
import {VisitDetails} from "../../components/receptionist/VisitDetails";
import {CancelVisitModal} from "../../components/receptionist/CancelVisitModal";
import {formatDoctorName, stripDoctorPrefix} from "../../features/staff/utils/formatDoctorName.ts";

interface DoctorDto {
    id: number;
    firstName: string;
    lastName: string;
}

interface VisitsPageProps {
    onNewVisit: (visitToEdit?: VisitDto | null, preferredDate?: string) => void;
}

export const VisitsPage = ({onNewVisit}: VisitsPageProps) => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [visits, setVisits] = useState<VisitDto[]>([]);
    const [activeTab, setActiveTab] = useState<string>('Registered');
    const [isLoading, setIsLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState<VisitDto | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [doctors, setDoctors] = useState<DoctorDto[]>([]);
    const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);

    const tabs = ['Registered', 'Cancelled', 'In progress', 'Finished'];
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers: HeadersInit = { "Content-Type": "application/json" };
            if (token) { headers["Authorization"] = `Bearer ${token}`; }

            const [visitsRes, doctorsRes] = await Promise.all([
                fetch(`${baseUrl}/visits`, { headers }),
                fetch(`${baseUrl}/staff?type=Doctor`, { headers })
            ]);

            if (visitsRes.ok) {
                const visitsData: VisitDto[] = await visitsRes.json();
                setVisits(visitsData);
            }

            if (doctorsRes.ok) {
                const doctorsData: DoctorDto[] = await doctorsRes.json();
                setDoctors(doctorsData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    const filteredVisits = visits.filter(v => {
        if (!v.appointmentDate) return false;

        const matchesStatus = v.status.toLowerCase() === activeTab.toLowerCase();
        if (!matchesStatus) return false;

        if (selectedDoctors.length > 0) {
            const cleanDocName = stripDoctorPrefix(v.doctorName || "").toLowerCase();
            const hasDoctor = selectedDoctors.some(docName =>
                cleanDocName === docName.toLowerCase().trim()
            );
            if (!hasDoctor) return false;
        }

        const cleanQuery = searchQuery.trim().toLowerCase();
        if (cleanQuery.length > 0) {
            const patientNameLower = (v.patientName || "").toLowerCase();
            const peselLower = (v.socialSecurityNo || "").toLowerCase();
            return patientNameLower.includes(cleanQuery) || peselLower.includes(cleanQuery);
        } else {
            const visitDate = v.appointmentDate.split('T')[0];
            return visitDate === selectedDate;
        }
    });

    const handleDoctorCheckboxChange = (doctorFullName: string) => {
        setSelectedVisit(null);
        if (selectedDoctors.includes(doctorFullName)) {
            setSelectedDoctors(selectedDoctors.filter(name => name !== doctorFullName));
        } else {
            setSelectedDoctors([...selectedDoctors, doctorFullName]);
        }
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    const handleCancelVisit = async () => {
        if (!selectedVisit) return;
        try {
            const token = localStorage.getItem("token");
            const headers: HeadersInit = { "Content-Type": "application/json" };
            if (token) { headers["Authorization"] = `Bearer ${token}`; }

            const response = await fetch(`${baseUrl}/visits/${selectedVisit.id}/cancel`, {
                method: "PATCH",
                headers: headers
            });
            if (response.ok) {
                setShowCancelModal(false);
                setSelectedVisit(null);
                await fetchData();
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="container-fluid py-4 px-5">
            <div className="mb-4">
                <DateStripline
                    selectedDate={selectedDate}
                    onDateChange={(date) => {
                        setSelectedDate(date);
                        setSelectedVisit(null);
                    }}
                />
            </div>

            {/* MINIMALISTYCZNA SEKCJA FILTRÓW W JEDNEJ LINII - BEZ TŁA I BEZ BRZYDKIEJ RAMKI */}
            <div className="d-flex flex-wrap align-items-end gap-4 mb-5 text-start">

                {/* Zgrabny, krótki search bar po lewej stronie */}
                <div style={{ minWidth: '320px', maxWidth: '380px' }}>
                    <label className="form-label fw-bold text-secondary small text-uppercase mb-2">
                        Search Patient / PESEL
                    </label>
                    <div className="input-group position-relative">
                        <span className="input-group-text bg-light border-2 border-end-0" style={{borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px'}}>
                            <i className="fa-solid fa-magnifying-glass text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-2 border-start-0 border-end-0 bg-light py-2"
                            placeholder="Enter name or PESEL..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setSelectedVisit(null);
                            }}
                            style={{ paddingRight: '40px' }}
                        />
                        {searchQuery.length > 0 ? (
                            <button
                                className="btn border-2 border-start-0 bg-light text-secondary position-absolute end-0 h-100 px-3 z-3"
                                style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', borderColor: '#dee2e6' }}
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedVisit(null);
                                }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        ) : (
                            <span className="input-group-text bg-light border-2 border-start-0" style={{ width: '42px', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}></span>
                        )}
                    </div>
                </div>

                {/* Lekkie, nowoczesne tagi-przyciski lekarzy umieszczone obok */}
                <div className="flex-grow-1">
                    <label className="form-label fw-bold text-secondary small text-uppercase mb-2 d-block">
                        Filter by Doctors
                    </label>
                    <div className="d-flex flex-wrap gap-2 align-items-center" style={{ paddingBottom: '2px' }}>
                        {doctors.map(doc => {
                            const fullName = `${doc.firstName} ${doc.lastName}`;
                            const isChecked = selectedDoctors.includes(fullName);
                            return (
                                <div
                                    key={doc.id}
                                    className="d-flex align-items-center me-3 py-1"
                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => handleDoctorCheckboxChange(fullName)}
                                >
                                    {/* AUTORSKI SPERSONALIZOWANY CHECKBOX - BIAŁY W ŚRODKU, CIEMNIEJSZA RAMKA */}
                                    <div
                                        className="d-flex align-items-center justify-content-center me-2"
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            backgroundColor: '#ffffff',
                                            border: isChecked ? '2px solid #0d6efd' : '2px solid #6c757d', // Ciemniejsza ramka w stanie spoczynku
                                            borderRadius: '4px',
                                            transition: 'all 0.1s ease-in-out',
                                            color: '#0d6efd',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {isChecked && <i className="fa-solid fa-check fw-bold"></i>}
                                    </div>

                                    {/* CZYSTY TEKST BEZ ŻADNYCH CHUJOWYCH RAMEK WOKÓŁ NAZWISKA */}
                                    <span className={`fw-semibold ${isChecked ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '0.95rem' }}>
                {formatDoctorName(doc.firstName, doc.lastName)}
            </span>
                                </div>
                            );
                        })}

                        {/* Przycisk resetu lekarzy */}
                        {selectedDoctors.length > 0 && (
                            <button
                                className="btn btn-link btn-sm text-danger fw-bold text-decoration-none ms-2 p-0 small"
                                onClick={() => {
                                    setSelectedDoctors([]);
                                    setSelectedVisit(null);
                                }}
                            >
                                Reset ({selectedDoctors.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">
                    {searchQuery.trim().length > 0
                        ? `Found Results in "${activeTab}"`
                        : `Upcoming Visits ${isToday ? "(Today)" : `(${selectedDate})`}`}
                </h2>
                <button className="btn btn-primary fw-bold px-4 shadow-sm" onClick={() => onNewVisit(null, selectedDate)} style={{borderRadius: '10px'}}>
                    <i className="fa-solid fa-plus me-2"></i> New Visit
                </button>
            </header>

            <div className="row g-4">
                <div className={selectedVisit ? "col-md-8" : "col-md-12"} style={{transition: 'all 0.3s ease'}}>
                    <VisitTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(tab) => {
                            setActiveTab(tab);
                            setSelectedVisit(null);
                        }}
                    />

                    <VisitList
                        visits={filteredVisits}
                        isLoading={isLoading}
                        onSelectVisit={setSelectedVisit}
                        selectedVisitId={selectedVisit?.id}
                        isSearching={searchQuery.trim().length > 0}
                    />
                </div>

                {selectedVisit && (
                    <div className="col-md-4">
                        <VisitDetails
                            visit={selectedVisit}
                            onClose={() => setSelectedVisit(null)}
                            onCancelClick={() => {
                                if (selectedVisit.status.toLowerCase() === 'registered') {
                                    setShowCancelModal(true);
                                }
                            }}
                            onEditClick={() => {
                                if (selectedVisit.status.toLowerCase() === 'registered') {
                                    onNewVisit(selectedVisit);
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            {showCancelModal && selectedVisit && (
                <CancelVisitModal
                    visit={selectedVisit}
                    onConfirm={handleCancelVisit}
                    onClose={() => setShowCancelModal(false)}
                />
            )}
        </div>
    );
};
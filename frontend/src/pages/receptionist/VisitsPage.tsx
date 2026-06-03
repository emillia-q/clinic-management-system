import {useEffect, useState, useCallback} from 'react';
import type {VisitDto} from "../../features/visits/types/visit.types.ts";
import {VisitList} from "../../features/visits/ui/VisitList";
import {VisitDetails} from "../../features/visits/ui/VisitDetailsPanel";
import {CancelVisitModal} from "../../features/visits/ui/CancelVisitModal";
import {formatDoctorName, stripDoctorPrefix} from "../../shared/lib/formatDoctorName";
import {DateStripline, SegmentedTabs} from "../../shared/ui";
import {SearchField} from "../../shared/ui/SearchField";
import {
    BTN_TOOLBAR_PRIMARY,
    DASHBOARD_PAGE_CLASS,
    FORM_LABEL_CLASS,
    PAGE_TITLE_CLASS,
    SEARCH_FIELD_WRAPPER_STYLE,
    SPLIT_PANEL_TRANSITION_STYLE,
    roundedStyle,
} from "../../shared/ui/styles";

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

    const [activeTab, setActiveTab] = useState<string>('All');
    const [isLoading, setIsLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState<VisitDto | null>(null);
    const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>("");

    const [doctors, setDoctors] = useState<DoctorDto[]>([]);
    const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);

    const tabs = ['All', 'Registered', 'Cancelled', 'In progress', 'Finished'];
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

        if (activeTab !== 'All') {
            const matchesStatus = v.status.toLowerCase() === activeTab.toLowerCase();
            if (!matchesStatus) return false;
        }

        if (selectedDoctors.length > 0) {
            const cleanDocName = stripDoctorPrefix(v.doctorName || "").toLowerCase();
            const hasDoctor = selectedDoctors.some(docName =>
                cleanDocName === docName.toLowerCase().trim()
            );
            if (!hasDoctor) return false;
        }

        const cleanQuery = appliedSearchQuery.trim().toLowerCase();
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

    const isSearchEmpty = appliedSearchQuery.trim().length === 0;

    return (
        <div className={DASHBOARD_PAGE_CLASS}>
            <style>{`
                .custom-searchfield-container .text-danger,
                .custom-searchfield-container .fa-xmark,
                .custom-searchfield-container button {
                    display: ${isSearchEmpty ? 'none !important' : 'inline-block !important'};
                }
            `}</style>

            <div className="mb-4">
                <DateStripline
                    selectedDate={selectedDate}
                    onDateChange={(date) => {
                        setSelectedDate(date);
                        setSelectedVisit(null);
                    }}
                />
            </div>

            <div className="d-flex flex-wrap align-items-end gap-4 mb-5 text-start">
                <div className="custom-searchfield-container">
                    <SearchField
                        label="Search Patient / PESEL"
                        placeholder="Enter name or PESEL..."
                        className=""
                        wrapperStyle={SEARCH_FIELD_WRAPPER_STYLE}
                        onSearch={(query) => {
                            setAppliedSearchQuery(query ?? "");
                            setSelectedVisit(null);
                        }}
                    />
                </div>

                <div className="flex-grow-1">
                    <label className={`${FORM_LABEL_CLASS} d-block`}>
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
                                    <div
                                        className="d-flex align-items-center justify-content-center me-2"
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            backgroundColor: '#ffffff',
                                            border: isChecked ? '2px solid #0d6efd' : '2px solid #6c757d',
                                            borderRadius: '4px',
                                            transition: 'all 0.1s ease-in-out',
                                            color: '#0d6efd',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {isChecked && <i className="fa-solid fa-check fw-bold"></i>}
                                    </div>

                                    <span className={`fw-semibold ${isChecked ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '0.95rem' }}>
                                        {formatDoctorName(doc.firstName, doc.lastName)}
                                    </span>
                                </div>
                            );
                        })}

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
                <h2 className={PAGE_TITLE_CLASS}>
                    {appliedSearchQuery.trim().length > 0
                        ? `Found Results in "${activeTab}"`
                        : `Upcoming Visits ${isToday ? "(Today)" : `(${selectedDate})`}`}
                </h2>
                <button className={BTN_TOOLBAR_PRIMARY} style={roundedStyle} onClick={() => onNewVisit(null, selectedDate)}>
                    <i className="fa-solid fa-plus me-2"></i> New Visit
                </button>
            </header>

            <div className="row g-4">
                <div className={selectedVisit ? "col-md-8" : "col-md-12"} style={SPLIT_PANEL_TRANSITION_STYLE}>
                    <SegmentedTabs
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
                        isSearching={appliedSearchQuery.trim().length > 0}
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
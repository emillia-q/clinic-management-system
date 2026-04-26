import {useEffect, useState, useCallback} from 'react';
import type {VisitDto} from "../../features/visits/types/visit.types.ts";
import {VisitTabs} from "../../components/receptionist/VisitTabs";
import {VisitList} from "../../components/receptionist/VisitList";
import {DateStripline} from "../../components/receptionist/DateStripline";
import {VisitDetails} from "../../components/receptionist/VisitDetails";
import {CancelVisitModal} from "../../components/receptionist/CancelVisitModal";

interface VisitsPageProps {
    onNewVisit: () => void;
}

export const VisitsPage = ({onNewVisit}: VisitsPageProps) => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [visits, setVisits] = useState<VisitDto[]>([]);
    const [activeTab, setActiveTab] = useState<string>('Registered');
    const [isLoading, setIsLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState<VisitDto | null>(null);

    const tabs = ['Registered', 'Cancelled', 'In progress', 'Finished'];

    const fetchVisits = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/v1/visits");
            if (response.ok) {
                const data: VisitDto[] = await response.json();
                setVisits(data);
            }
        } catch (error) {
            console.error("Error fetching visits:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchVisits();
    }, [fetchVisits]);

    const filteredVisits = visits.filter(v => {
        const visitDate = v.appointmentDate.split('T')[0];
        return visitDate === selectedDate && v.status.toLowerCase() === activeTab.toLowerCase();
    });

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    const handleCancelVisit = async () => {
        if (!selectedVisit) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/visits/${selectedVisit.id}/cancel`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"}
            });

            if (response.ok) {
                setShowCancelModal(false);
                setSelectedVisit(null);
                await fetchVisits();
            } else {
                alert("Failed to cancel visit.");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="container-fluid py-4 px-5">
            <div className="mb-5">
                <DateStripline
                    selectedDate={selectedDate}
                    onDateChange={(date) => {
                        setSelectedDate(date);
                        setSelectedVisit(null);
                    }}
                />
            </div>

            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">
                    Upcoming Visits {isToday ? "(Today)" : `(${selectedDate})`}
                </h2>
                <button className="btn btn-primary fw-bold px-4 shadow-sm" onClick={onNewVisit}>
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
                    />
                </div>

                {selectedVisit && (
                    <div className="col-md-4">
                        <VisitDetails
                            visit={selectedVisit}
                            onClose={() => setSelectedVisit(null)}
                            onCancelClick={() => setShowCancelModal(true)}
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
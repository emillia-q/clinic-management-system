import type {PatientUpcomingVisitDto} from "../../patients/types/patient.types";
import {PatientDetailsConst} from "../../patients/ui/PatientDetailsConst";
import {format, parseISO} from 'date-fns';

interface PatientDetailsProps {
    patientVisit: PatientUpcomingVisitDto | null;
    onClose: () => void;
    onRefresh: () => void;
    onViewHistory: (id: number) => void;
}


export const PatientDetailsForDoctor = ({patientVisit, onClose, onRefresh, onViewHistory}: PatientDetailsProps) => {
    // If no patientVisit is selected, render nothing
    if (!patientVisit) return null;

    return (
        <div className="card shadow-sm border-0 h-100 position-sticky" style={{top: "20px"}}>
            <PatientDetailsConst patient={patientVisit.patient} onClose={onClose}/>
            <div className="px-4 d-flex flex-column">
                <div className="mb-2 d-flex align-items-baseline">
                    <small className="text-muted d-block fw-bold me-1" style={{fontSize: '0.85rem'}}>
                        Upcoming Appointment:</small>
                    {patientVisit.upcomingVisit ? (
                        <span className="text-dark">
                            {format(parseISO(patientVisit.upcomingVisit), 'yyyy-MM-dd HH:mm:ss')}
                        </span>
                    ) : (
                        <span className="text-dark">Not registered</span>
                    )}
                </div>

                <div className="text-center" style={{marginTop: '20px'}}>
                    <button
                        className="btn btn-outline-dark fw-bold py-2 shadow-sm mb-2 w-50"
                        onClick={() => onViewHistory(patientVisit.patient.id)}
                    > View History
                    </button>
                </div>

            </div>
        </div>
    )
}
import type {PatientUpcomingVisitDto} from "../../patients/types/patient.types";
import {PatientDetailsConst} from "../../patients/ui/PatientDetailsConst";
import {format, parseISO} from 'date-fns';
import {DetailFieldLabel} from "../../../shared/ui/DetailFieldLabel";
import {BTN_PANEL_OUTLINE} from "../../../shared/ui/styles";

interface PatientDetailsProps {
    patientVisit: PatientUpcomingVisitDto | null;
    onClose: () => void;
    onRefresh: () => void;
    onViewHistory: (id: number) => void;
}

export const PatientDetailsForDoctor = ({patientVisit, onClose, onViewHistory}: PatientDetailsProps) => {
    if (!patientVisit) return null;

    return (
        <div className="card shadow-sm border-0 h-100 position-sticky" style={{top: "20px"}}>
            <PatientDetailsConst patient={patientVisit.patient} onClose={onClose}/>
            <div className="px-4 pb-4 d-flex flex-column">
                <div className="mb-2 d-flex align-items-baseline">
                    <DetailFieldLabel className="d-inline me-1 mb-0">Upcoming Appointment:</DetailFieldLabel>
                    {patientVisit.upcomingVisit ? (
                        <span className="text-dark">
                            {format(parseISO(patientVisit.upcomingVisit), 'yyyy-MM-dd HH:mm:ss')}
                        </span>
                    ) : (
                        <span className="text-dark">Not registered</span>
                    )}
                </div>

                <div className="text-center mt-3">
                    <button
                        className={`${BTN_PANEL_OUTLINE} w-50`}
                        onClick={() => onViewHistory(patientVisit.patient.id)}
                    >
                        View History
                    </button>
                </div>
            </div>
        </div>
    );
};

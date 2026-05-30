import type {VisitDto} from "../../features/visits/types/visit.types.ts";
import {formatDoctorFromFullName} from "../../features/staff/utils/formatDoctorName.ts";
import {DetailFieldLabel} from "../../shared/ui/DetailFieldLabel";
import {
    BTN_PANEL_DANGER,
    BTN_PANEL_OUTLINE,
    PANEL_TITLE_CLASS,
    roundedStyle,
    StatusBadge,
    UI_CARD_BORDER_RADIUS,
} from "../../shared/ui";

interface VisitDetailsProps {
    visit: VisitDto;
    onClose: () => void;
    onCancelClick: () => void;
    onEditClick: () => void;
}

export const VisitDetails = ({visit, onClose, onCancelClick, onEditClick}: VisitDetailsProps) => {
    const dateObj = new Date(visit.appointmentDate);
    const formattedDate = dateObj.toLocaleDateString('pl-PL');
    const formattedTime = dateObj.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    return (
        <div className="card border-0 shadow-sm h-100 overflow-auto" style={{borderRadius: UI_CARD_BORDER_RADIUS}}>
            <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <h5 className={PANEL_TITLE_CLASS}>Visit Details</h5>
                    <button className="btn btn-link text-dark p-0" onClick={onClose}>
                        <i className="fa-solid fa-xmark fs-4"></i>
                    </button>
                </div>

                <div className="vstack gap-3 mb-5">
                    <div>
                        <DetailFieldLabel>Visit ID:</DetailFieldLabel>
                        <p className="mb-0 fw-semibold">{visit.id}</p>
                    </div>
                    <div>
                        <DetailFieldLabel>Visit Date:</DetailFieldLabel>
                        <p className="mb-0">{formattedDate}</p>
                    </div>
                    <div>
                        <DetailFieldLabel>Visit Time:</DetailFieldLabel>
                        <p className="mb-0">{formattedTime}</p>
                    </div>
                    <hr className="my-2 opacity-10"/>
                    <div>
                        <DetailFieldLabel>Patient Name:</DetailFieldLabel>
                        <p className="mb-0 fw-bold text-dark">{visit.patientName}</p>
                    </div>
                    <div>
                        <DetailFieldLabel>Patient PESEL:</DetailFieldLabel>
                        <p className="mb-0">{visit.socialSecurityNo}</p>
                    </div>
                    <hr className="my-2 opacity-10"/>
                    <div>
                        <DetailFieldLabel>Doctor:</DetailFieldLabel>
                        <p className="mb-0 fw-semibold text-dark">{formatDoctorFromFullName(visit.doctorName)}</p>
                    </div>
                    <div>
                        <DetailFieldLabel>Visit Status:</DetailFieldLabel>
                        <StatusBadge status={visit.status} domain="visit" padded={false} className="mt-1" />
                    </div>
                </div>

                {visit.status.toLowerCase() === 'registered' && (
                    <div className="d-flex gap-2 mt-auto pt-4 w-100">
                        <button
                            className={`${BTN_PANEL_OUTLINE} flex-grow-1`}
                            style={roundedStyle}
                            onClick={onEditClick}
                        >
                            Edit
                        </button>
                        <button
                            className={`${BTN_PANEL_DANGER} flex-grow-1`}
                            style={roundedStyle}
                            onClick={onCancelClick}
                        >
                            Cancel Visit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

import type {VisitDto} from "../../features/visits/types/visit.types.ts";

interface VisitDetailsProps {
    visit: VisitDto;
    onClose: () => void;
    onCancelClick: () => void;
    onEditClick: () => void; // Dodajemy nowy prop!
}

export const VisitDetails = ({visit, onClose, onCancelClick, onEditClick}: VisitDetailsProps) => {
    const dateObj = new Date(visit.appointmentDate);
    const formattedDate = dateObj.toLocaleDateString('pl-PL');
    const formattedTime = dateObj.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    return (
        <div className="card border-0 shadow-sm h-100 overflow-auto" style={{borderRadius: '15px'}}>
            <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <h3 className="fw-bold mb-0">Visit Details</h3>
                    <button className="btn btn-link text-dark p-0" onClick={onClose}>
                        <i className="fa-solid fa-xmark fs-4"></i>
                    </button>
                </div>

                {/* Lista detali */}
                <div className="vstack gap-3 mb-5">
                    <div>
                        <label className="text-secondary small fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Visit
                            ID:</label>
                        <p className="mb-0 fw-semibold">{visit.id}</p>
                    </div>
                    <div>
                        <label className="text-secondary small fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Visit
                            Date:</label>
                        <p className="mb-0">{formattedDate}</p>
                    </div>
                    <div>
                        <label className="text-secondary small fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Visit
                            Time:</label>
                        <p className="mb-0">{formattedTime}</p>
                    </div>
                    <hr className="my-2 opacity-10"/>
                    <div>
                        <label className="text-secondary small fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Patient
                            Name:</label>
                        <p className="mb-0 fw-bold fs-5 text-dark">{visit.patientName}</p>
                    </div>
                    <div>
                        <label className="text-secondary small fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Patient
                            PESEL:</label>
                        <p className="mb-0">{visit.socialSecurityNo}</p>
                    </div>
                    <hr className="my-2 opacity-10"/>
                    <div>
                        <label className="text-secondary small fw-bold text-uppercase"
                               style={{fontSize: '0.7rem'}}>Doctor:</label>
                        <p className="mb-0 fw-semibold text-dark">Dr. {visit.doctorName}</p>
                    </div>
                    <div>
                        <label className="text-secondary small fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Visit
                            Status:</label>
                        <p className="mb-0 fw-bold" style={{color: '#0d6efd'}}>{visit.status}</p>
                    </div>
                </div>

                {visit.status.toLowerCase() === 'registered' && (
                    <div className="d-flex gap-2 mt-auto pt-4 w-100">
                        <button
                            className="btn btn-outline-dark flex-grow-1 fw-bold py-2"
                            style={{borderRadius: '10px'}}
                            onClick={onEditClick}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-outline-danger flex-grow-1 fw-bold py-2"
                            style={{borderRadius: '10px'}}
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


import type {VisitDto} from "../../services/types.ts";

interface CancelVisitModalProps {
    visit: VisitDto;
    onConfirm: () => void;
    onClose: () => void;
}

export const CancelVisitModal = ({visit, onConfirm, onClose}: CancelVisitModalProps) => {
    return (
        <div className="modal-backdrop d-flex align-items-center justify-content-center"
             style={{
                 backgroundColor: 'rgba(0,0,0,0.5)',
                 position: 'fixed',
                 top: 0,
                 left: 0,
                 width: '100%',
                 height: '100%',
                 zIndex: 1050
             }}>
            <div className="card border-0 shadow-lg" style={{maxWidth: '450px', width: '90%', borderRadius: '15px'}}>
                <div className="card-body p-4 text-center">
                    <div className="mb-3 text-danger">
                        <i className="fa-solid fa-circle-exclamation fs-1"></i>
                    </div>
                    <h4 className="fw-bold mb-3">Cancel Visit?</h4>
                    <p className="text-secondary mb-4">
                        Are you sure you want to cancel the visit for <strong>{visit.patientName}</strong>?
                        <br/>
                        <span className="small text-muted">
                            Scheduled on: {new Date(visit.appointmentDate).toLocaleDateString()} at {new Date(visit.appointmentDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </span>
                    </p>

                    <div className="d-grid gap-2">
                        <button className="btn btn-danger py-2 fw-bold" onClick={onConfirm}
                                style={{borderRadius: '10px'}}>
                            Yes, Cancel Visit
                        </button>
                        <button className="btn btn-light py-2 fw-bold" onClick={onClose} style={{borderRadius: '10px'}}>
                            No, keep it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
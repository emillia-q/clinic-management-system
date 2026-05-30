import type {LabExamDetails} from '../types/types.tsx';
import {UI_CARD_BORDER_RADIUS, UI_MODAL_MAX_WIDTH, roundedStyle} from '../../../shared/ui/styles';

interface CancelExamModalProps {
    exam: LabExamDetails;
    onConfirm: () => void;
    onClose: () => void;
}

export const CancelExamModal = ({exam, onConfirm, onClose}: CancelExamModalProps) => {
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
            <div className="card border-0 shadow-lg" style={{maxWidth: UI_MODAL_MAX_WIDTH, width: '90%', borderRadius: UI_CARD_BORDER_RADIUS}}>
                <div className="card-body p-4 text-center">
                    <div className="mb-3 text-danger">
                        <i className="fa-solid fa-circle-exclamation fs-1"></i>
                    </div>
                    <h5 className="fw-bold mb-3">Cancel Exam?</h5>
                    <p className="text-secondary mb-4">
                        Are you sure you want to cancel this exam for <strong>{exam.patientName}</strong>?
                        <br/>
                        <span className="small text-muted">
                            {exam.examName} ({exam.examCode})
                        </span>
                    </p>

                    <div className="d-grid gap-2">
                        <button className="btn btn-danger py-2 fw-bold" onClick={onConfirm} style={roundedStyle}>
                            Yes, Cancel Exam
                        </button>
                        <button className="btn btn-light py-2 fw-bold" onClick={onClose} style={roundedStyle}>
                            No, keep it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

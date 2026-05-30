import {useState} from 'react';
import type {LabExamDetails} from '../types/types.tsx';

interface ManagerVerificationDetailsProps {
    exam: LabExamDetails;
    onClose: () => void;
    onApprove: (examId: number) => void;
    onReject: (examId: number, notes: string) => void;
}

export const ManagerVerificationDetails = ({
    exam,
    onClose,
    onApprove,
    onReject,
}: ManagerVerificationDetailsProps) => {
    const [managerNotes, setManagerNotes] = useState('');
    const [notesError, setNotesError] = useState<string | null>(null);
    const isPendingVerification = exam.status.toLowerCase() === 'completed';

    const handleReject = () => {
        if (!managerNotes.trim()) {
            setNotesError('Manager notes are required for rejection');
            return;
        }
        setNotesError(null);
        onReject(exam.id, managerNotes);
    };

    return (
        <div className="card shadow-sm border-0 h-100 position-sticky" style={{top: '20px'}}>
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3 px-3">
                <h5 className="mb-0 fw-bold text-primary">Verification Details</h5>
                <button
                    className="btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                    onClick={onClose}
                    style={{width: '32px', height: '32px', border: '1px solid #dee2e6'}}
                >
                    <i className="fa-solid fa-xmark text-dark"></i>
                </button>
            </div>

            <div className="card-body px-4 d-flex flex-column">
                <div className="mt-2 pt-3 border-top overflow-auto" style={{maxHeight: '60vh'}}>
                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>Exam Id:</small>
                        <span className="text-dark">{exam.id}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>Patient Name:</small>
                        <span className="text-dark">{exam.patientName}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>PESEL:</small>
                        <span className="text-dark">{exam.patientPesel}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>Exam Name:</small>
                        <span className="text-dark">{exam.examName}</span>
                    </div>

                    <div className="mb-3">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1"
                               style={{fontSize: '0.7rem'}}>Result:</small>
                        <div className="p-3 bg-light border rounded text-dark">
                            {exam.result || 'No result provided.'}
                        </div>
                    </div>

                    {exam.doctorNotes && (
                        <div className="mb-2 d-flex align-items-baseline">
                            <small className="text-muted d-block text-uppercase fw-bold me-1"
                                   style={{fontSize: '0.7rem'}}>Doctor Notes:</small>
                            <span className="text-dark">{exam.doctorNotes}</span>
                        </div>
                    )}

                    {exam.managerNotes && !isPendingVerification && (
                        <div className="mb-3">
                            <small className="text-muted d-block text-uppercase fw-bold mb-1"
                                   style={{fontSize: '0.7rem'}}>Manager Notes:</small>
                            <div className="p-3 bg-light border rounded text-dark">{exam.managerNotes}</div>
                        </div>
                    )}

                    {isPendingVerification && (
                        <div className="mb-3">
                            <small className="text-muted d-block text-uppercase fw-bold mb-1"
                                   style={{fontSize: '0.7rem'}}>Manager Notes (required for reject):</small>
                            <textarea
                                className={`form-control ${notesError ? 'is-invalid' : ''}`}
                                rows={3}
                                placeholder="Type your notes or rejection reason here..."
                                value={managerNotes}
                                onChange={(e) => {
                                    setManagerNotes(e.target.value);
                                    if (e.target.value.trim()) {
                                        setNotesError(null);
                                    }
                                }}
                            />
                            {notesError && <div className="invalid-feedback small">{notesError}</div>}
                        </div>
                    )}
                </div>
            </div>

            {isPendingVerification && (
                <div className="px-4 pb-4 d-flex flex-column gap-2">
                    <div className="text-center">
                        <button
                            className="btn btn-outline-dark fw-bold py-2 shadow-sm w-50"
                            onClick={() => onApprove(exam.id)}
                        >
                            <i className="fa-solid fa-check me-2"></i> Approve
                        </button>
                    </div>
                    <div className="text-center">
                        <button
                            className="btn btn-danger fw-bold py-2 shadow-sm w-50"
                            onClick={handleReject}
                        >
                            <i className="fa-solid fa-xmark me-2"></i> Reject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

import type {LabExamDetails} from '../types/types.tsx'
import {format, parseISO} from 'date-fns';
import {useState} from "react";

interface ExamDetailsProps {
    exam: LabExamDetails;
    onClose: () => void
    onCompleteExam: (result: string) => void;
    onCancelExam: (reason: string) => void;
}

export const ExamDetails = ({exam, onClose, onCompleteExam, onCancelExam}: ExamDetailsProps) => {
    const [editingResults, setEditingResults] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleCompleteClick = () => {
        if (!result.trim()) {
            setError("Result is required");
            return;
        }
        setError(null);
        onCompleteExam(result);
    };

    return (
        <div className="card shadow-sm border-0 h-100 position-sticky" style={{top: "20px"}}>
            {/* Header with Close Button */}
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3 px-3">
                <h5 className="mb-0 fw-bold text-primary">Exam Details</h5>
                <button
                    className="btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                    onClick={onClose}
                    style={{width: "32px", height: "32px", border: "1px solid #dee2e6"}}
                >
                    <i className="fa-solid fa-xmark text-dark"></i>
                </button>
            </div>


            <div className="card-body px-4 d-flex flex-column">
                {/*Details List*/}
                <div className="mt-2 pt-3 border-top overflow-auto" style={{maxHeight: '60vh'}}>

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
                               style={{fontSize: '0.7rem'}}>Exam Code:</small>
                        <span className="text-dark">{exam.examCode}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>Exam Name:</small>
                        <span className="text-dark">{exam.examName}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>Exam Id:</small>
                        <span className="text-dark">{exam.id}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>Ordered By:</small>
                        <span className="text-dark">{exam.orderedByDoctor}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>Order Date:</small>
                        <span className="text-dark">
                            {format(parseISO(exam.orderDate), 'yyyy-MM-dd')}
                        </span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>Doctor Notes:</small>
                        <span className="text-dark">{exam.doctorNotes}</span>
                    </div>
                </div>
            </div>

            {/*The buttons*/}
            <div className="px-4 d-flex flex-column">
                {/* Enter results || Complete exam */}
                {!editingResults ? (
                    <div className="text-center" style={{marginTop: '20px'}}>
                        <button
                            className="btn btn-outline-dark fw-bold py-2 shadow-sm mb-2 w-50"
                            onClick={() => setEditingResults(true)}
                        >
                            Enter Results
                        </button>
                    </div>
                ) : (
                    <>
                        {/*Results input */}
                        <div className="mb-3">
                            <small className="text-muted d-block text-uppercase fw-bold mb-1"
                                   style={{fontSize: '0.7rem'}}>Results:</small>
                            <textarea
                                name="result"
                                className={`form-control w-100 ${error ? 'is-invalid' : ''}`}
                                value={result}
                                onChange={(e) => {
                                    setResult(e.target.value);
                                    if (e.target.value.trim()) {
                                        setError(null);
                                    }
                                }}
                                rows={4}
                                wrap="off" // Prevents auto-wrapping to enforce horizontal scrolling
                                style={{overflowX: 'auto'}} // Enables horizontal scrollbar when full
                            />
                            {error && <div className="invalid-feedback small">{error}</div>}
                        </div>

                        {/*Complete exam button*/}
                        <div className="text-center" style={{marginTop: '20px'}}>
                            <button
                                className="btn btn-outline-dark fw-bold py-2 shadow-sm mb-2 w-50"
                                onClick={handleCompleteClick}
                            >
                                Complete Exam
                            </button>
                        </div>
                    </>
                )
                }
                {/*Cancel Exam*/}
                <div className="text-center">
                    <button
                        className="btn btn-outline-dark fw-bold py-2 shadow-sm mb-2 w-50"
                        onClick={() => onCancelExam("Canceled")}
                    >
                        Cancel Exam
                    </button>
                </div>

            </div>
        </div>
    );
}
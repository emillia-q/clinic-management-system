import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { orderExam } from '../../features/exams/api/exam.api';
import axios from 'axios';

interface OrderExamPageProps {
    visitId: number | null;
    onBack: () => void;
}

export const OrderExamPage = ({ visitId, onBack }: OrderExamPageProps) => {
    const [examType, setExamType] = useState('Laboratory');
    const [examName, setExamName] = useState('L43');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [notesError, setNotesError] = useState<string | null>(null);

    const flatlyDark = "#2C3E50";
    const flatlyLight = "#ECF0F1";

    useEffect(() => {
        if (examType === 'Laboratory') {
            setExamName('L43');
        } else {
            setExamName('89.383');
        }
    }, [examType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!notes || notes.trim() === "") {
            setNotesError(
                examType === 'Laboratory'
                    ? "Doctor notes are required to place the order."
                    : "Exam results are required to submit."
            );
            return;
        }

        setNotesError(null);
        setIsLoading(true);
        try {
            await orderExam(examType, { visitId: Number(visitId), examName, notes });
            toast.success(
                examType === 'Laboratory' ? "Order placed successfully!" : "Exam results submitted successfully!",
                {
                    duration: 4000,
                    style: {
                        borderRadius: '4px',
                        border: `1px solid ${flatlyDark}`,
                        color: '#000',
                    },
                }
            );
            onBack();
        } catch (error) {
            let serverMessage = "An unexpected error occurred";

            if (axios.isAxiosError(error)) {
                serverMessage = error.response?.data?.message || error.message;
                console.error("Full error details:", error.response?.data);
            } else if (error instanceof Error) {
                serverMessage = error.message;
            }

            toast.error("Error: " + serverMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const renderExamOptions = () => {
        if (examType === 'Laboratory') {
            return (
                <>
                    <option value="L43">Glucose Level (Serum)</option>
                    <option value="C55">Morphology (Full Blood Count)</option>
                    <option value="A01">Urinalysis (General)</option>
                    <option value="O17">Lipid Profile</option>
                </>
            );
        } else {
            return (
                <>
                    <option value="89.383">Spirometry Test</option>
                    <option value="95.1901">Visual Acuity Test</option>
                    <option value="89.142">Holter EEG</option>
                    <option value="81.92">Joint or Ligament Injection</option>
                </>
            );
        }
    };

    return (
        <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center font-sans position-relative">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 p-5 rounded shadow-sm position-relative" style={{ backgroundColor: flatlyLight }}>

                        <button
                            onClick={onBack}
                            className="btn btn-link p-0 fs-3 text-decoration-none position-absolute start-0 top-0 mt-4 ms-4"
                            style={{ color: flatlyDark }}
                        >
                            &larr;
                        </button>

                        <div className="text-center mb-5 pt-2">
                            <h2 className="fw-bold mb-1" style={{ color: flatlyDark }}>
                                {examType === 'Laboratory' ? 'Order a New Exam' : 'Submit Exam Results'}
                            </h2>
                            {visitId && (
                                <h5 className="text-muted fw-semibold">
                                    Visit ID: {visitId}
                                </h5>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="px-2 text-start" noValidate>
                            <div className="mb-4">
                                <label className="form-label fw-bold fs-5" style={{ color: flatlyDark }}>Exam Type</label>
                                <select
                                    className="form-select border-2 py-2"
                                    style={{ borderRadius: '4px', borderColor: flatlyDark }}
                                    value={examType}
                                    onChange={(e) => setExamType(e.target.value)}
                                >
                                    <option value="Laboratory">Laboratory</option>
                                    <option value="Physical">Physical</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold fs-5" style={{ color: flatlyDark }}>Exam Name</label>
                                <select
                                    className="form-select border-2 py-2"
                                    style={{ borderRadius: '4px', borderColor: flatlyDark }}
                                    value={examName}
                                    onChange={(e) => setExamName(e.target.value)}
                                >
                                    {renderExamOptions()}
                                </select>
                            </div>

                            <div className="mb-5">
                                <label className="form-label fw-bold fs-5" style={{ color: flatlyDark }}>
                                    {examType === 'Laboratory' ? 'Doctor Notes' : 'Exam Results'} <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    className={`form-control border-2 ${notesError ? 'is-invalid border-danger' : ''}`}
                                    style={{ borderRadius: '4px', resize: 'none', borderColor: notesError ? undefined : flatlyDark }}
                                    rows={6}
                                    value={notes}
                                    onChange={(e) => {
                                        setNotes(e.target.value);
                                        if (e.target.value.trim() !== "") {
                                            setNotesError(null);
                                        }
                                    }}
                                />
                                {notesError && (
                                    <div className="invalid-feedback fw-bold mt-1">
                                        {notesError}
                                    </div>
                                )}
                            </div>

                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn py-3 fw-bold text-uppercase text-white d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: flatlyDark, borderRadius: '4px', border: 'none' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            {examType === 'Laboratory' ? "Ordering..." : "Submitting..."}
                                        </>
                                    ) : (
                                        examType === 'Laboratory' ? "Order" : "Submit"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
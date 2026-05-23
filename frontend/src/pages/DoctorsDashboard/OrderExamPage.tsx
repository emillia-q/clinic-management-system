import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { orderExam } from '../../features/exams/api/exam.api';

interface OrderExamPageProps {
    visitId: number | null;
    onBack: () => void;
}

export const OrderExamPage = ({ visitId, onBack }: OrderExamPageProps) => {
    const [examType, setExamType] = useState('Laboratory');
    const [examName, setExamName] = useState('L43');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (examType === 'Laboratory') {
            setExamName('L43');
        } else {
            setExamName('89.383');
        }
    }, [examType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await orderExam(examType, { visitId: Number(visitId), examName, notes });
            toast.success(
                examType === 'Laboratory' ? "Order placed successfully!" : "Exam results submitted successfully!",
                {
                    duration: 4000,
                    style: {
                        borderRadius: '0',
                        border: '1px solid #000',
                        color: '#000',
                    },
                }
            );
            onBack();
        } catch (error: any) {
            const serverMessage = error.response?.data?.message || error.message;
            toast.error("Error: " + serverMessage);
            console.error("Full error details:", error.response?.data);
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
        <div className="container d-flex justify-content-center py-5">
            <div className="card border-0" style={{ maxWidth: '600px', width: '100%', backgroundColor: '#fff' }}>
                <div className="card-body">
                    <div className="d-flex align-items-center mb-5">
                        <button className="btn btn-link text-dark p-0 me-3" onClick={onBack}>
                            <i className="fa-solid fa-arrow-left fs-3"></i>
                        </button>
                        <h2 className="fw-bold mb-0 mx-auto">
                            {examType === 'Laboratory' ? 'Order a New Exam' : 'Submit Exam Results'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 text-start">
                            <label className="form-label fw-bold small">Exam Type</label>
                            <select
                                className="form-select"
                                style={{ borderRadius: '0', border: '1px solid #000' }}
                                value={examType}
                                onChange={(e) => setExamType(e.target.value)}
                            >
                                <option value="Laboratory">Laboratory</option>
                                <option value="Physical">Physical</option>
                            </select>
                        </div>

                        <div className="mb-4 text-start">
                            <label className="form-label fw-bold small">Exam Name</label>
                            <select
                                className="form-select"
                                style={{ borderRadius: '0', border: '1px solid #000' }}
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                            >
                                {renderExamOptions()}
                            </select>
                        </div>

                        <div className="mb-4 text-start">
                            <label className="form-label fw-bold small">
                                {examType === 'Laboratory' ? 'Doctor Notes' : 'Exam Results'}
                            </label>
                            <textarea
                                className="form-control"
                                style={{ borderRadius: '0', border: '2px solid #000', resize: 'none' }}
                                rows={8}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                required
                            />
                        </div>

                        <div className="text-center mt-5">
                            <button
                                type="submit"
                                className="btn btn-outline-dark px-5 py-2 fw-bold text-uppercase"
                                style={{ borderRadius: '0', border: '1px solid #000' }}
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? (examType === 'Laboratory' ? "Ordering..." : "Submitting...")
                                    : (examType === 'Laboratory' ? "Order" : "Submit")
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
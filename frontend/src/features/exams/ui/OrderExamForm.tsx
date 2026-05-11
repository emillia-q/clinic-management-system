import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderExam } from '../api/exam.api';

const OrderExamForm = () => {
    const { visitId } = useParams<{ visitId: string }>();
    const navigate = useNavigate();

    const [examType, setExamType] = useState('Laboratory');
    const [examName, setExamName] = useState('Blood Glucose');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await orderExam(examType, { visitId: Number(visitId), examName, notes });
            alert("Order placed successfully!");
            navigate(-1);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong";
            alert(errorMessage);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.formContainer}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>

                <h1 style={styles.title}>Order a New Exam</h1>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Exam Type</label>
                        <select
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            style={styles.input}
                        >
                            <option value="Laboratory">Laboratory</option>
                            <option value="Physical">Physical</option>
                        </select>
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Exam Name</label>
                        <select
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            style={styles.input}
                        >
                            <option value="Blood Glucose">Blood Glucose</option>
                            <option value="Urine Test">Urine Test</option>
                            <option value="X-Ray">X-Ray</option>
                        </select>
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={styles.textarea}
                            rows={8}
                        />
                    </div>

                    <div style={styles.footer}>
                        <button type="submit" style={styles.orderButton}>Order</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    pageWrapper: {
        backgroundColor: '#fff',
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
    },
    formContainer: {
        width: '100%',
        maxWidth: '550px',
        padding: '40px 20px',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: '-20px',
        top: '45px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    },
    title: {
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '40px',
        color: '#000',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#000',
        textAlign: 'left',
    },
    input: {
        padding: '12px',
        border: '1px solid #000',
        borderRadius: '0',
        backgroundColor: '#fff',
        fontSize: '16px',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        backgroundSize: '16px',
    },
    textarea: {
        padding: '12px',
        border: '2px solid #000',
        borderRadius: '0',
        fontSize: '16px',
        resize: 'none',
    },
    footer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    orderButton: {
        padding: '10px 60px',
        border: '1px solid #000',
        background: 'transparent',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
};

export default OrderExamForm;
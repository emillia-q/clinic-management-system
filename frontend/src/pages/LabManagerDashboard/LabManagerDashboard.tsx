import React, { useState, useEffect } from 'react';


export interface LabExamDto {
    id: number;
    examCode: string;
    examName: string;
    patientName: string;
    patientPesel: string;
    orderedByDoctor: string;
    orderDate: string;
    completionDate: string;
    status: 'Completed' | 'Ordered' | 'Rejected' | 'Validated' | 'Canceled';
    result: string;
    doctorNotes: string;
    managerNotes: string;
    labTechnicianId: number | null;
    labManagerId: number | null;
    doctorId: number;
    patientId: number;
}

const STATUS_TABS = ['Completed', 'Validated', 'Rejected'];

export const LabManagerDashboard = () => {
    const [exams, setExams] = useState<LabExamDto[]>([]);
    const [activeTab, setActiveTab] = useState<string>('Completed');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExam, setSelectedExam] = useState<LabExamDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [managerNotes, setManagerNotes] = useState('');

    useEffect(() => {
        const fetchExams = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";


                const url = activeTab === 'Completed'
                    ? `${baseUrl}/lab-manager/exams/to-verify`
                    : `${baseUrl}/lab-manager/exams?status=${activeTab}`;

                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data: LabExamDto[] = await response.json();
                    setExams(data);
                } else {
                    console.error("Błąd pobierania badań:", await response.text());
                    setExams([]);
                }
            } catch (error) {
                console.error("Błąd sieci:", error);
                setExams([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExams();
    }, [activeTab]);

    const handleAction = async (examId: number, action: 'approve' | 'reject') => {
        if (action === 'reject' && !managerNotes.trim()) {
            alert("Manager notes are required for rejection!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

            const response = await fetch(`${baseUrl}/lab-manager/exams/${examId}/${action}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ notes: managerNotes })
            });


            if (!response.ok) {
                const errorText = await response.text();
                console.error("Action failed with response:", errorText);
                alert(`Błąd: ${errorText}`);
                return;
            }


            setExams(prevExams => prevExams.filter(exam => exam.id !== examId));
            setSelectedExam(null);
            setManagerNotes('');

            alert(`Exam successfully ${action}d!`);

        } catch (error) {
            console.error("Action failed:", error);
            alert("Błąd podczas zapisywania akcji!");
        }
    };

    const filteredExams = exams.filter(exam => {
        const pName = exam.patientName || "";
        const eName = exam.examName || "";
        return pName.toLowerCase().includes(searchQuery.toLowerCase()) || eName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className="bg-white shadow-sm border p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold m-0">Laboratory Exams Verification</h3>
                    <div className="d-flex" style={{ width: '300px' }}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control rounded-0 border-dark"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span className="input-group-text bg-white border-dark rounded-0">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className={selectedExam ? "col-lg-8" : "col-lg-12"} style={{ transition: 'all 0.3s ease' }}>

                        <div className="d-flex border border-dark mb-3">
                            {STATUS_TABS.map(tab => (
                                <button
                                    key={tab}
                                    className={`btn rounded-0 flex-grow-1 fw-bold border-0 ${activeTab === tab ? 'bg-dark text-white' : 'bg-white text-dark'}`}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setSelectedExam(null);
                                    }}
                                    style={{ borderRight: tab !== 'Rejected' ? '1px solid #000 !important' : 'none' }}
                                >
                                    {tab} {tab === 'Completed' && <span className="ms-1 fw-normal">(To Verify)</span>}
                                </button>
                            ))}
                        </div>

                        <div className="table-responsive border-top border-dark border-2 mt-3">
                            <table className="table table-hover align-middle">
                                <thead>
                                <tr>
                                    <th className="border-bottom border-dark text-muted fw-bold py-3">Patient Name</th>
                                    <th className="border-bottom border-dark text-muted fw-bold py-3">Exam Name</th>
                                    <th className="border-bottom border-dark text-muted fw-bold py-3">Ordered by</th>
                                    <th className="border-bottom border-dark text-muted fw-bold py-3">Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={4} className="text-center py-5 fw-bold">Loading exams...</td></tr>
                                ) : filteredExams.length > 0 ? (
                                    filteredExams.map((exam) => (
                                        <tr
                                            key={exam.id}
                                            onClick={() => {
                                                setSelectedExam(exam);
                                                setManagerNotes('');
                                            }}
                                            style={{ cursor: 'pointer', backgroundColor: selectedExam?.id === exam.id ? '#e9ecef' : 'transparent' }}
                                        >
                                            <td className="py-3 border-bottom border-secondary">{exam.patientName || "Unknown"}</td>
                                            <td className="py-3 border-bottom border-secondary">{exam.examName || "Unknown"}</td>
                                            <td className="py-3 border-bottom border-secondary">{exam.orderedByDoctor || "-"}</td>
                                            <td className="py-3 border-bottom border-secondary">
                                                    <span className={`badge ${exam.status === 'Completed' ? 'bg-warning text-dark' : exam.status === 'Validated' ? 'bg-success' : 'bg-danger'}`}>
                                                        {exam.status}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-muted">No exams found in this category.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {selectedExam && (
                        <div className="col-lg-4 border-start border-dark border-2 ps-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold m-0">Verification Details</h4>
                                <button
                                    className="btn btn-sm btn-outline-dark rounded-circle"
                                    style={{ width: '30px', height: '30px', padding: '0', lineHeight: '1' }}
                                    onClick={() => setSelectedExam(null)}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            <div className="d-flex flex-column gap-3 fs-6">
                                <div><span className="text-muted">Exam ID:</span> <span className="fw-medium">{selectedExam.id}</span></div>
                                <div><span className="text-muted">Result:</span> <div className="fw-medium p-3 bg-light border mt-1 rounded">{selectedExam.result || "No result provided."}</div></div>

                                {selectedExam.doctorNotes && (
                                    <div className="mt-2"><span className="text-muted">Doctor Notes:</span> <span className="fw-medium">{selectedExam.doctorNotes}</span></div>
                                )}


                                {selectedExam.managerNotes && selectedExam.status !== 'Completed' && (
                                    <div className="mt-2"><span className="text-muted">Manager Notes:</span> <div className="fw-medium p-3 bg-light border mt-1 rounded">{selectedExam.managerNotes}</div></div>
                                )}


                                {selectedExam.status === 'Completed' && (
                                    <div className="mt-3">
                                        <label className="form-label text-muted fw-bold mb-1">Manager Notes (Required for Reject):</label>
                                        <textarea
                                            className="form-control border-dark"
                                            rows={3}
                                            placeholder="Type your notes or rejection reason here..."
                                            value={managerNotes}
                                            onChange={(e) => setManagerNotes(e.target.value)}
                                        ></textarea>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-3 border-top">
                                {selectedExam.status === 'Completed' && (
                                    <div className="d-flex flex-column gap-2">
                                        <button
                                            className="btn btn-success fw-bold rounded-0 px-4 py-2 w-100"
                                            onClick={() => handleAction(selectedExam.id, 'approve')}
                                        >
                                            <i className="fa-solid fa-check me-2"></i> Approve
                                        </button>
                                        <button
                                            className="btn btn-danger fw-bold rounded-0 px-4 py-2 w-100"
                                            onClick={() => handleAction(selectedExam.id, 'reject')}
                                        >
                                            <i className="fa-solid fa-xmark me-2"></i> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
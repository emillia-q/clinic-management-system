import type {LabExamDetails} from '../types'
import {format, parseISO} from 'date-fns';

interface ExamListProps {
    exams: LabExamDetails[];
    isLoading: boolean;
    onSelectExam: (exam: LabExamDetails) => void;
    selectedExamId?: number;
}

export const ExamList = ({exams, onSelectExam, selectedExamId}: ExamListProps) => {
    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                        <tr className="text-secondary small fw-bold text-uppercase">
                            <th className="px-4 py-3">ID</th>
                            <th className="py-3">Patient Name</th>
                            <th className="py-3">Exam Name</th>
                            <th className="py-3">Ordered By</th>
                            <th className="py-3">Order Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {exams.length > 0 ? (
                            exams.map((ex) => (
                                <tr
                                    key={ex.id}
                                    onClick={() => onSelectExam(ex)}
                                    style={{cursor: 'pointer'}}
                                    className={selectedExamId === ex.id ? "table-primary" : ""}
                                >
                                    <td className="px-4 text-muted small">#{ex.id}</td>
                                    <td>{ex.patientName}</td>
                                    <td>{ex.examName}</td>
                                    <td>{ex.orderedByDoctor}</td>
                                    <td> {format(parseISO(ex.orderDate), 'yyyy-MM-dd')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-5">
                                    <div className="text-muted">
                                        <i className="fa-solid fa-users-slash fa-3x mb-3 opacity-25"></i>
                                        <p className="mb-0">No pending exams.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


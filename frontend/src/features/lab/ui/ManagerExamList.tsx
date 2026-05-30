import type {LabExamDetails} from '../types/types.tsx';

interface ManagerExamListProps {
    exams: LabExamDetails[];
    isLoading: boolean;
    onSelectExam: (exam: LabExamDetails) => void;
    selectedExamId?: number;
}

const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'completed') return 'bg-warning text-dark';
    if (s === 'validated') return 'bg-success';
    if (s === 'rejected') return 'bg-danger';
    return 'bg-secondary';
};

export const ManagerExamList = ({exams, isLoading, onSelectExam, selectedExamId}: ManagerExamListProps) => {
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
                            <th className="py-3 text-center">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-5 text-muted">Loading exams...</td>
                            </tr>
                        ) : exams.length > 0 ? (
                            exams.map((exam) => (
                                <tr
                                    key={exam.id}
                                    onClick={() => onSelectExam(exam)}
                                    style={{cursor: 'pointer'}}
                                    className={selectedExamId === exam.id ? 'table-active' : ''}
                                >
                                    <td className="px-4 text-muted small">#{exam.id}</td>
                                    <td>{exam.patientName}</td>
                                    <td>{exam.examName}</td>
                                    <td>{exam.orderedByDoctor || '-'}</td>
                                    <td className="text-center">
                                        <span className={`badge ${getStatusBadgeClass(exam.status)}`}>
                                            {exam.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-5">
                                    <div className="text-muted">
                                        <i className="fa-solid fa-flask fa-3x mb-3 opacity-25"></i>
                                        <p className="mb-0">No exams found in this category.</p>
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

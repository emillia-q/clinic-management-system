import type {LabExamDetails} from '../types';
import {StatusBadge} from '../../../shared/ui';
import {TABLE_HEAD_ROW_CLASS} from '../../../shared/ui/styles';

interface ManagerExamListProps {
    exams: LabExamDetails[];
    isLoading: boolean;
    onSelectExam: (exam: LabExamDetails) => void;
    selectedExamId?: number;
}

export const ManagerExamList = ({exams, isLoading, onSelectExam, selectedExamId}: ManagerExamListProps) => {
    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                        <tr className={TABLE_HEAD_ROW_CLASS}>
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
                                        <StatusBadge status={exam.status} domain="labExam" padded={false} />
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

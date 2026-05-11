import type {PatientDto} from "../types/patient.types.ts";

interface PatientListProps {
    patients: PatientDto[];
    isLoading: boolean;
    onSelectPatient: (patient: PatientDto) => void;
    selectedPatientId?: number;
    showDOBColl?: boolean;
}

export const PatientList = ({patients, onSelectPatient, selectedPatientId, showDOBColl = true}: PatientListProps) => {
    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                        <tr className="text-secondary small fw-bold text-uppercase">
                            <th className="px-4 py-3">ID</th>
                            <th className="py-3">Full Name</th>
                            <th className="py-3">PESEL (SSN)</th>
                            {showDOBColl ? <th className="py-3">Date of Birth</th> : null}
                        </tr>
                        </thead>
                        <tbody>
                        {patients.length > 0 ? (
                            patients.map((p) => (
                                <tr
                                    key={p.id}
                                    onClick={() => onSelectPatient(p)}
                                    style={{cursor: 'pointer'}}
                                    className={selectedPatientId === p.id ? "table-primary" : ""}
                                >
                                    <td className="px-4 text-muted small">#{p.id}</td>
                                    <td className="fw-bold">{p.firstName} {p.lastName}</td>
                                    <td><code className="text-dark">{p.socialSecurityNo}</code></td>
                                    {showDOBColl ? <td className="px-4">{p.dateOfBirth}</td> : null}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-5">
                                    <div className="text-muted">
                                        <i className="fa-solid fa-users-slash fa-3x mb-3 opacity-25"></i>
                                        <p className="mb-0">No patients found in the system.</p>
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
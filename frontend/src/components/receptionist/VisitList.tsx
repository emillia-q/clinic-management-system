import type {VisitDto} from "../../features/visits/types/visit.types.ts";
import {formatDoctorFromFullName} from "../../features/staff/utils/formatDoctorName.ts";

interface VisitListProps {
    visits: VisitDto[];
    isLoading: boolean;
    onSelectVisit: (visit: VisitDto) => void;
    selectedVisitId?: number;
    isSearching: boolean; // <--- NOWY PROP: Informacja czy tryb wyszukiwania jest aktywny
}

export const VisitList = ({visits, isLoading, onSelectVisit, selectedVisitId, isSearching}: VisitListProps) => {
    const getStatusClass = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'registered') return 'bg-primary text-white';
        if (s === 'in progress') return 'bg-warning text-dark';
        if (s === 'finished') return 'bg-success text-white';
        if (s === 'cancelled') return 'bg-danger text-white';
        return 'bg-secondary text-white';
    };

    return (
        <div className="bg-white border-start border-end border-bottom border-2 shadow-sm">
            <table className="table table-hover mb-0">
                <thead className="table-light">
                <tr className="border-bottom border-2">
                    {/* Jeśli szukamy, poszerzamy lekko kolumnę na datę + czas */}
                    <th className="py-3 px-4 fw-bold text-secondary" style={{width: isSearching ? '240px' : '150px'}}>
                        {isSearching ? 'DATE & TIME' : 'TIME'}
                    </th>
                    <th className="py-3 fw-bold text-secondary">PATIENT NAME</th>
                    <th className="py-3 fw-bold text-secondary">DOCTOR</th>
                    <th className="py-3 fw-bold text-secondary text-center">STATUS</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={4} className="text-center py-5 text-muted">Loading...</td>
                    </tr>
                ) : visits.length > 0 ? (
                    visits.map(visit => (
                        <tr
                            key={visit.id}
                            onClick={() => onSelectVisit(visit)}
                            className={selectedVisitId === visit.id ? "table-active" : ""}
                            style={{cursor: 'pointer', verticalAlign: 'middle'}}
                        >
                            <td className="py-3 px-4 fw-bold">
                                {/* WARUNKOWE RENDEROWANIE DATY: Tylko gdy isSearching === true */}
                                {isSearching && (
                                    <span className="badge bg-light text-dark border me-2 fw-bold text-uppercase" style={{fontSize: '0.75rem'}}>
                                        {new Date(visit.appointmentDate).toLocaleDateString('pl-PL', {
                                            day: '2-digit',
                                            month: '2-digit'
                                        })}
                                    </span>
                                )}
                                <span>
                                    {new Date(visit.appointmentDate).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </td>
                            <td className="py-3 fw-semibold text-dark">{visit.patientName}</td>
                            <td className="py-3 text-muted">{formatDoctorFromFullName(visit.doctorName)}</td>
                            <td className="py-3 text-center">
                                    <span className={`badge py-2 px-3 ${getStatusClass(visit.status)}`}>
                                        {visit.status.toUpperCase()}
                                    </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="text-center py-5 text-muted">No visits found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};
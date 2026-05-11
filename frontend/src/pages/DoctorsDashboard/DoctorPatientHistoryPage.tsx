import type {PatientDto} from "../../features/patients/types/patient.types.ts";
import {HistoryListSection} from "../../features/doctors/ui/HistoryListSection.tsx";
import {useDoctorPatientHistory} from "../../features/doctors/model/useDoctorPatientHistory.ts";

interface DoctorPatientHistoryPageProps {
    patient: PatientDto;
    onBack: () => void;
}

export const DoctorPatientHistoryPage = ({patient, onBack}: DoctorPatientHistoryPageProps) => {
    const {history, isLoading, historyUnavailable} = useDoctorPatientHistory(patient.id);

    return (
        <div className="container py-4">
            <div className="mx-auto bg-white shadow-sm p-4" style={{maxWidth: "780px"}}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <button className="btn btn-link text-dark p-0" onClick={onBack}>
                        <i className="fa-solid fa-arrow-left fs-4"/>
                    </button>
                    <h3 className="h4 mb-0 fw-bold text-center flex-grow-1">
                        Visit History: {patient.firstName} {patient.lastName}
                    </h3>
                    <div style={{width: "28px"}}/>
                </div>

                <div className="bg-light px-3 py-2 mb-3 fw-bold">Previous Appointments</div>

                {historyUnavailable && (
                    <div className="alert alert-light border py-2 px-3 mb-3">
                        No results found (history endpoint unavailable).
                    </div>
                )}

                {isLoading ? (
                    <div className="text-muted">Loading history...</div>
                ) : (
                    <>
                        <HistoryListSection title="Visits" items={history?.visits ?? []}/>
                        <HistoryListSection title="Physical Exams" items={history?.physicalExams ?? []}/>
                        <HistoryListSection title="Laboratory Exams" items={history?.labExams ?? []}/>
                    </>
                )}
            </div>
        </div>
    );
};

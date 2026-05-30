import type {PatientDto} from "../../features/patients/types/patient.types.ts";
import {HistoryListSection} from "../../features/doctors/ui/HistoryListSection.tsx";
import {useDoctorPatientHistory} from "../../features/doctors/model/useDoctorPatientHistory.ts";
import {DASHBOARD_PAGE_CLASS, PAGE_TITLE_CLASS, UI_BORDER_RADIUS} from "../../shared/ui/styles";

interface DoctorPatientHistoryPageProps {
    patient: PatientDto;
    onBack: () => void;
}

export const DoctorPatientHistoryPage = ({patient, onBack}: DoctorPatientHistoryPageProps) => {
    const {history, isLoading, historyUnavailable} = useDoctorPatientHistory(patient.id);

    return (
        <div className={DASHBOARD_PAGE_CLASS}>
            <div className="mx-auto bg-white shadow-sm p-4" style={{maxWidth: "780px", borderRadius: UI_BORDER_RADIUS}}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <button className="btn btn-link text-dark p-0" onClick={onBack}>
                        <i className="fa-solid fa-arrow-left fs-4"/>
                    </button>
                    <h2 className={`${PAGE_TITLE_CLASS} mb-0 text-center flex-grow-1 fs-4`}>
                        Visit History: {patient.firstName} {patient.lastName}
                    </h2>
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
                        <HistoryListSection title="Visits" items={history?.visits ?? []} sectionType="visits"/>
                        <HistoryListSection title="Physical Exams" items={history?.physicalExams ?? []} sectionType="physicalExams"/>
                        <HistoryListSection title="Laboratory Exams" items={history?.labExams ?? []} sectionType="labExams"/>
                    </>
                )}
            </div>
        </div>
    );
};

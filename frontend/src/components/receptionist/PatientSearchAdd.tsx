import {SearchPatients} from "../../features/patients/ui/SearchPatients.tsx";
import {UI_BORDER_RADIUS} from "../../shared/ui/styles";

interface PatientSearchProps {
    onSearch: (query: string | null) => void;
    onAddPatientClick: () => void;
}

export const PatientSearchAdd = ({onSearch, onAddPatientClick}: PatientSearchProps) => {
    return (
        <div className="row mb-4 align-items-end">
            <SearchPatients onSearch={onSearch} />
            <div className="col-md-7 text-end">
                <button
                    className="btn btn-primary shadow-sm px-4 fw-bold"
                    onClick={onAddPatientClick}
                    style={{borderRadius: UI_BORDER_RADIUS}}
                >
                    <i className="fa-solid fa-user-plus me-2"></i>
                    Add New Patient
                </button>
            </div>
        </div>
    );
};

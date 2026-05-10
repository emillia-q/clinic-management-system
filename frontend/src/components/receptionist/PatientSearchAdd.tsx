import {SearchPatients, type SearchPatientsData} from "../../features/patients/ui/SearchPatients.tsx";

interface PatientSearchProps {
    onSearch: (params: SearchPatientsData | null) => void;
    onAddPatientClick: () => void;
}

export const PatientSearchAdd = ({onSearch, onAddPatientClick}: PatientSearchProps) => {
    return (
        <div className="row mb-4 align-items-end">
            <SearchPatients onSearch={onSearch}
            />
            {/* Add New Patient Button */}
            <div className="col-md-7 text-end">
                <button className="btn btn-primary shadow-sm px-4 fw-bold" onClick={onAddPatientClick}
                        style={{borderRadius: '10px'}}>
                    <i className="fa-solid fa-user-plus me-2"></i>
                    Add New Patient
                </button>
            </div>
        </div>
    );
};
interface PatientSearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddPatientClick: () => void;
}

export const PatientSearch = ({searchQuery, onSearchChange, onAddPatientClick}: PatientSearchProps) => {
    return (
        <div className="row mb-4 align-items-end">
            <div className="col-md-5">
                <label className="form-label small fw-bold text-muted">SEARCH PATIENTS</label>
                <div className="input-group shadow-sm">
                    <span className="input-group-text bg-white border-end-0">
                        <i className="fa-solid fa-magnifying-glass text-muted"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Search by Name or PESEL..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
            <div className="col-md-7 text-end">
                <button className="btn btn-primary shadow-sm px-4" onClick={onAddPatientClick}>
                    <i className="fa-solid fa-user-plus me-2"></i>
                    Add New Patient
                </button>
            </div>
        </div>
    );
};
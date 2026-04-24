import React, {useState} from 'react';

interface PatientSearchProps {
    onSearch: (query: string) => void;
    onAddPatientClick: () => void;
}

export const PatientSearch = ({onSearch, onAddPatientClick}: PatientSearchProps) => {
    const [localQuery, setLocalQuery] = useState("");

    const handleSearchSubmit = () => {
        onSearch(localQuery);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    return (
        <div className="row mb-4 align-items-end">
            <div className="col-md-5">
                <label className="form-label small fw-bold text-muted text-uppercase">Search Patients</label>
                <div className="input-group shadow-sm">
                    <input
                        type="text"
                        className="form-control border-end-0"
                        placeholder="Search by Name or PESEL..."
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px'}}
                    />
                    <button
                        className="btn btn-white border border-start-0 text-primary"
                        type="button"
                        onClick={handleSearchSubmit}
                        style={{borderTopRightRadius: '10px', borderBottomRightRadius: '10px'}}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </div>
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
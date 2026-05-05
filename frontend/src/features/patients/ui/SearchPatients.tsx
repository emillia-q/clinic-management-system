import React, {useState} from 'react';

export interface SearchPatientsData {
    name: string | null;
    surname: string | null;
    pesel: string | null;
}

interface PatientSearchProps {
    onSearch: (params: SearchPatientsData) => void;
}

export const SearchPatients = ({onSearch}: PatientSearchProps) => {
    const [localQuery, setLocalQuery] = useState("");

    const handleSearchSubmit = () => {
        //extract words from string
        const data: SearchPatientsData = {name: null, surname: null, pesel: null};
        const words: string[] = localQuery.trim().split(/\s+/);
        if (words.length === 0) return null;
        words.forEach((word) => {
            if (/^\d+$/.test(word)) data.pesel = word;
            else {
                if (word.trim().length !== 0) {
                    if (data.name === null) {
                        data.name = word;
                    } else {
                        data.surname = word;
                    }
                }
            }
        });
        onSearch(data);
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
        </div>
    );
}
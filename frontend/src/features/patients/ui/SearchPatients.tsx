import {SearchField} from '../../../shared/ui/SearchField';

export interface SearchPatientsData {
    name: string | null;
    surname: string | null;
    pesel: string | null;
}

interface PatientSearchProps {
    onSearch: (params: SearchPatientsData | null) => void;
}

const parsePatientQuery = (query: string): SearchPatientsData | null => {
    const data: SearchPatientsData = {name: null, surname: null, pesel: null};
    const words = query.trim().split(/\s+/);
    if (words.length === 0 || (words.length === 1 && words[0] === '')) {
        return null;
    }

    words.forEach((word) => {
        if (/^\d+$/.test(word)) {
            data.pesel = word;
        } else if (word.trim().length !== 0) {
            if (data.name === null) {
                data.name = word;
            } else {
                data.surname = word;
            }
        }
    });

    return data;
};

export const SearchPatients = ({onSearch}: PatientSearchProps) => {
    const handleSearch = (query: string | null) => {
        if (!query) {
            onSearch(null);
            return;
        }
        onSearch(parsePatientQuery(query));
    };

    return (
        <SearchField
            label="Search Patients"
            placeholder="Search by Full Name or PESEL..."
            onSearch={handleSearch}
        />
    );
};

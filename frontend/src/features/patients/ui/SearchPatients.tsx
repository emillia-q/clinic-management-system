import {SearchField} from '../../../shared/ui/SearchField';

interface PatientSearchProps {
    onSearch: (query: string | null) => void;
}

export const SearchPatients = ({onSearch}: PatientSearchProps) => (
    <SearchField
        label="Search Patients"
        placeholder="Search by name or PESEL..."
        onSearch={onSearch}
    />
);

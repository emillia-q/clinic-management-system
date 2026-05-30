import {SearchField} from '../../../shared/ui/SearchField';

interface ExamTypeSearchProps {
    onSearch: (params: string | null) => void;
}

export const SearchExamType = ({onSearch}: ExamTypeSearchProps) => (
    <SearchField
        label="Patient"
        placeholder="Search by patient name or PESEL..."
        onSearch={onSearch}
    />
);

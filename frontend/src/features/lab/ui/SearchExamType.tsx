import {SearchWithCancel} from '../../../shared/ui/SearchWithCancel.tsx'


interface ExamTypeSearchProps {
    onSearch: (params: string | null) => void;
}

export const SearchExamType = ({onSearch}: ExamTypeSearchProps) => {

    return (
        <SearchWithCancel onSearch={onSearch} searchForText={"Exam Types"} placeholderText={"Search Exam Types..."}/>
    );
}
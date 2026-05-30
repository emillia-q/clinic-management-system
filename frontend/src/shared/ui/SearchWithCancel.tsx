import {SearchField} from './SearchField';

interface SearchWithCancelProps {
    onSearch: (params: string | null) => void;
    searchForText: string;
    placeholderText: string;
}

/** @deprecated Use SearchField from shared/ui instead */
export const SearchWithCancel = ({onSearch, searchForText, placeholderText}: SearchWithCancelProps) => (
    <SearchField
        label={searchForText}
        placeholder={placeholderText}
        onSearch={onSearch}
    />
);

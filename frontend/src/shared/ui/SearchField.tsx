import React, {useState} from 'react';
import {
    SEARCH_FIELD_CLASS,
    SEARCH_LABEL_CLASS,
    UI_BORDER_RADIUS,
} from './styles';

export interface SearchFieldProps {
    placeholder: string;
    onSearch: (query: string | null) => void;
    label?: string;
    className?: string;
    wrapperStyle?: React.CSSProperties;
}

export const SearchField = ({
                                placeholder,
                                onSearch,
                                label,
                                className = SEARCH_FIELD_CLASS,
                                wrapperStyle,
                            }: SearchFieldProps) => {
    const [localQuery, setLocalQuery] = useState('');

    const handleSearchSubmit = () => {
        const trimmed = localQuery.trim();
        onSearch(trimmed.length > 0 ? trimmed : null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const handleClearSearch = () => {
        setLocalQuery('');
        onSearch(null);
    };

    const isSearchActive = localQuery.trim().length > 0;

    return (
        <div className={className} style={wrapperStyle}>
            {label && (
                <label className={SEARCH_LABEL_CLASS}>
                    {label}
                </label>
            )}
            <div className="input-group shadow-sm">
                <input
                    type="text"
                    className="form-control border-end-0"
                    placeholder={placeholder}
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        borderTopLeftRadius: UI_BORDER_RADIUS,
                        borderBottomLeftRadius: UI_BORDER_RADIUS,
                    }}
                />
                <button
                    className="btn btn-white border border-start-0 text-primary"
                    type="button"
                    onClick={handleSearchSubmit}
                    aria-label="Search"
                    style={{
                        borderTopRightRadius: isSearchActive ? 0 : UI_BORDER_RADIUS,
                        borderBottomRightRadius: isSearchActive ? 0 : UI_BORDER_RADIUS,
                    }}
                >
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>

                {isSearchActive && (
                    <button
                        className="btn btn-white border border-start-0 text-danger"
                        type="button"
                        onClick={handleClearSearch}
                        aria-label="Clear search"
                        style={{
                            borderTopRightRadius: UI_BORDER_RADIUS,
                            borderBottomRightRadius: UI_BORDER_RADIUS,
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )}
            </div>
        </div>
    );
};
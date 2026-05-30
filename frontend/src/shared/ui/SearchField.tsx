import React, {useState} from 'react';
import {UI_BORDER_RADIUS} from './styles';

export interface SearchFieldProps {
    placeholder: string;
    onSearch: (query: string | null) => void;
    label?: string;
    className?: string;
    wrapperStyle?: React.CSSProperties;
    size?: 'default' | 'lg';
}

export const SearchField = ({
    placeholder,
    onSearch,
    label,
    className = 'col-md-5',
    wrapperStyle,
    size = 'default',
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

    const inputClass = size === 'lg' ? 'form-control form-control-lg border-end-0' : 'form-control border-end-0';

    return (
        <div className={className} style={wrapperStyle}>
            {label && (
                <label className="form-label small fw-bold text-muted text-uppercase mb-2">
                    {label}
                </label>
            )}
            <div className="input-group shadow-sm">
                <input
                    type="text"
                    className={inputClass}
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
                    style={{borderRadius: 0}}
                >
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
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
            </div>
        </div>
    );
};

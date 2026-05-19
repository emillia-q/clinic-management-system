import React, {useState} from 'react';

interface SearchWithCancelProps {
    onSearch: (params: string | null) => void;
    searchForText: string;
    placeholderText: string;
}

export const SearchWithCancel = ({onSearch, searchForText, placeholderText}: SearchWithCancelProps) => {
    const [localQuery, setLocalQuery] = useState("");

    const handleSearchSubmit = () => {
        onSearch(localQuery);
    }
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };
    const handleClearSearch = () => {
        setLocalQuery("");
        onSearch(null);
    }


    return (
        <>  {/* Use a Fragment instead of a <div> to avoid layout breaking */}
            <div className="col-md-5">
                <label className="form-label small fw-bold text-muted text-uppercase">{searchForText}</label>
                <div className="input-group shadow-sm">
                    <input
                        type="text"
                        className="form-control border-end-0"
                        placeholder={placeholderText}
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px'}}
                    />
                    {/* Find Button */}
                    <button
                        className="btn btn-white border border-start-0 text-primary"
                        type="button"
                        onClick={handleSearchSubmit}
                        style={{borderRadius: '0'}} // Square edges to connect to the next button
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                    {/* "X" Clear Button */}
                    <button
                        className="btn btn-white border border-start-0 text-danger"
                        type="button"
                        onClick={handleClearSearch}
                        style={{
                            borderTopRightRadius: '10px',
                            borderBottomRightRadius: '10px'
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        </>
    );
}
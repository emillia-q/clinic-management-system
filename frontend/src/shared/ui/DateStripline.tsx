import {useRef} from 'react';

interface DateStriplineProps {
    selectedDate: string; // YYYY-MM-DD
    onDateChange: (date: string) => void;
}

export const DateStripline = ({selectedDate, onDateChange}: DateStriplineProps) => {
    const datePickerRef = useRef<HTMLInputElement>(null);

    const shiftDate = (amount: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + amount);
        onDateChange(newDate.toISOString().split('T')[0]);
    };

    const getDays = () => {
        const days = [];
        for (let i = -3; i <= 3; i++) {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const days = getDays();
    const firstDay = days[0];
    const lastDay = days[days.length - 1];

    const formatHeaderRange = () => {
        const monthStart = firstDay.toLocaleDateString('en-US', {month: 'short'});
        const dayStart = firstDay.getDate();
        const monthEnd = lastDay.toLocaleDateString('en-US', {month: 'short'});
        const dayEnd = lastDay.getDate();
        const year = lastDay.getFullYear();
        return `${monthStart} ${dayStart} - ${monthEnd} ${dayEnd}, ${year}`;
    };

    const handleIconClick = () => {
        datePickerRef.current?.showPicker();
    };

    const handleGoToToday = () => {
        const today = new Date().toISOString().split('T')[0];
        onDateChange(today);
    };

    return (
        <div className="d-flex justify-content-center w-100 mb-5">
            <div style={{width: 'fit-content'}}>

                <div className="d-flex align-items-center justify-content-between mb-3 w-100 px-1">
                    <div className="d-flex align-items-center">
                        <span className="fw-bold text-dark mb-0 me-3" style={{fontSize: '1.25rem'}}>
                            {formatHeaderRange()}
                        </span>
                        <div className="position-relative">
                            <i
                                className="fa-regular fa-calendar-days fs-5 text-primary"
                                style={{cursor: 'pointer'}}
                                onClick={handleIconClick}
                            ></i>
                            <input
                                ref={datePickerRef}
                                type="date"
                                className="position-absolute opacity-0"
                                style={{top: 0, left: 0, width: 0, height: 0, pointerEvents: 'none'}}
                                value={selectedDate}
                                onChange={(e) => onDateChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        className="btn btn-outline-dark btn-sm fw-bold ms-4"
                        style={{borderRadius: '8px', fontSize: '0.8rem'}}
                        onClick={handleGoToToday}
                    >
                        Current day
                    </button>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-link text-muted p-2" onClick={() => shiftDate(-1)}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <div className="d-flex gap-2">
                        {days.map((date, index) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const isSelected = dateStr === selectedDate;
                            const isToday = dateStr === new Date().toISOString().split('T')[0];

                            return (
                                <button
                                    key={index}
                                    onClick={() => onDateChange(dateStr)}
                                    className={`btn d-flex flex-column align-items-center justify-content-center shadow-sm border-2 ${
                                        isSelected ? 'btn-primary border-primary' : 'btn-white bg-white border-light'
                                    }`}
                                    style={{
                                        width: '75px',
                                        height: '85px',
                                        borderRadius: '12px',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <span
                                        className={`fw-bold mb-1 ${isSelected ? 'text-white' : 'text-secondary text-uppercase'}`}
                                        style={{fontSize: '0.65rem'}}>
                                        {date.toLocaleDateString('en-US', {weekday: 'short'})}
                                    </span>
                                    <span className={`fs-4 fw-bold ${isSelected ? 'text-white' : 'text-dark'}`}>
                                        {date.getDate()}
                                    </span>
                                    {isToday && !isSelected && (
                                        <div className="mt-1" style={{
                                            width: '6px',
                                            height: '6px',
                                            backgroundColor: '#0d6efd',
                                            borderRadius: '50%'
                                        }}></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <button className="btn btn-link text-muted p-2" onClick={() => shiftDate(1)}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
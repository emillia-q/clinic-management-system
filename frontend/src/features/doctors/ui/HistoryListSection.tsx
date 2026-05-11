import {format} from "date-fns";
import type {VisitHistoryItemDto} from "../types/patientHistory.types.ts";

interface HistoryListSectionProps {
    title: string;
    items: VisitHistoryItemDto[];
}

const formatHistoryDate = (date: string) => format(new Date(date), "dd.MM.yyyy");

export const HistoryListSection = ({title, items}: HistoryListSectionProps) => {
    return (
        <div className="mb-3">
            <h6 className="fw-bold mb-2">{title}</h6>
            <div className="border" style={{maxHeight: "150px", overflowY: "auto"}}>
                {items.length === 0 ? (
                    <div className="px-3 py-2 text-muted">No results found</div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="d-flex justify-content-between align-items-center border-bottom px-3 py-2"
                        >
                            <span>{formatHistoryDate(item.date)}</span>
                            <span className="text-center flex-grow-1">{item.type}</span>
                            <i className="fa-solid fa-chevron-down"/>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


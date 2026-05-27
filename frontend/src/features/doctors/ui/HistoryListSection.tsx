import {useState} from "react";
import {format} from "date-fns";
import type {LabExamDetailsDto, PhysicalExamDetailsDto, VisitDetailsDto, VisitHistoryItemDto} from "../types/patientHistory.types.ts";
import {doctorPatientHistoryApi} from "../api/doctorPatientHistoryApi.ts";

type SectionType = "visits" | "physicalExams" | "labExams";

interface HistoryListSectionProps {
    title: string;
    items: VisitHistoryItemDto[];
    sectionType: SectionType;
}

const fmt = (date: string | null | undefined) =>
    date ? format(new Date(date), "dd.MM.yyyy HH:mm") : "—";

const fmtDate = (date: string | null | undefined) =>
    date ? format(new Date(date), "dd.MM.yyyy") : "—";

const statusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === "finished" || s === "approved" || s === "done") return "badge bg-success";
    if (s === "cancelled" || s === "rejected") return "badge bg-danger";
    if (s === "in_progress" || s === "ordered") return "badge bg-warning text-dark";
    return "badge bg-secondary";
};

const DetailRow = ({label, value}: { label: string; value: React.ReactNode }) => (
    <div className="d-flex gap-2 mb-1 small">
        <span className="text-muted" style={{minWidth: "140px"}}>{label}:</span>
        <span className="fw-medium">{value ?? "—"}</span>
    </div>
);

const VisitDetail = ({detail}: { detail: VisitDetailsDto }) => (
    <div className="mt-2 px-1">
        <DetailRow label="Doctor" value={detail.doctorName}/>
        <DetailRow label="Status" value={<span className={statusBadgeClass(detail.status)}>{detail.status}</span>}/>
        <DetailRow label="Date" value={fmt(detail.appointmentDate)}/>
        {detail.description && <DetailRow label="Description" value={detail.description}/>}
        {detail.diagnosis && <DetailRow label="Diagnosis" value={detail.diagnosis}/>}
    </div>
);

const LabExamDetail = ({detail}: { detail: LabExamDetailsDto }) => (
    <div className="mt-2 px-1">
        <DetailRow label="Exam code" value={<code>{detail.examCode}</code>}/>
        <DetailRow label="Status" value={<span className={statusBadgeClass(detail.status)}>{detail.status}</span>}/>
        <DetailRow label="Ordered by" value={detail.orderedByDoctor}/>
        <DetailRow label="Order date" value={fmt(detail.orderDate)}/>
        <DetailRow
            label="Completion date"
            value={detail.completionDate ? fmt(detail.completionDate) : "—"}
        />
        <DetailRow label="Lab technician" value={detail.labTechnicianName}/>
        <DetailRow label="Approved by" value={detail.labManagerName}/>
        {detail.result && <DetailRow label="Result" value={detail.result}/>}
        {detail.doctorNotes && <DetailRow label="Doctor notes" value={detail.doctorNotes}/>}
        {detail.managerNotes && <DetailRow label="Manager notes" value={detail.managerNotes}/>}
    </div>
);

const PhysicalExamDetail = ({detail}: { detail: PhysicalExamDetailsDto }) => (
    <div className="mt-2 px-1">
        <DetailRow label="Exam code" value={<code>{detail.examCode}</code>}/>
        <DetailRow label="Doctor" value={detail.doctorName}/>
        <DetailRow label="Date" value={fmtDate(detail.date)}/>
        {detail.result && <DetailRow label="Result" value={detail.result}/>}
    </div>
);

type Details = VisitDetailsDto | LabExamDetailsDto | PhysicalExamDetailsDto;

const HistoryItemRow = ({item, sectionType}: { item: VisitHistoryItemDto; sectionType: SectionType }) => {
    const [expanded, setExpanded] = useState(false);
    const [details, setDetails] = useState<Details | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const displayLabel = item.examName ?? item.type;
    const displayDate = fmtDate(item.date);

    const handleToggle = async () => {
        if (expanded) {
            setExpanded(false);
            return;
        }
        setExpanded(true);
        if (details) return;
        setLoading(true);
        setError(false);
        try {
            let data: Details;
            if (sectionType === "visits") {
                data = await doctorPatientHistoryApi.getVisitDetails(item.id);
            } else if (sectionType === "labExams") {
                data = await doctorPatientHistoryApi.getLabExamDetails(item.id);
            } else {
                data = await doctorPatientHistoryApi.getPhysicalExamDetails(item.id);
            }
            setDetails(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border-bottom">
            <button
                type="button"
                className="w-100 d-flex justify-content-between align-items-center px-3 py-2 bg-transparent border-0 text-start"
                style={{cursor: "pointer"}}
                onClick={handleToggle}
            >
                <span className="text-muted small" style={{minWidth: "90px"}}>{displayDate}</span>
                <span className="flex-grow-1 px-2 fw-medium">{displayLabel}</span>
                <i className={`fa-solid fa-chevron-${expanded ? "up" : "down"} text-muted small`}/>
            </button>

            {expanded && (
                <div className="px-3 pb-2">
                    {loading && <div className="text-muted small">Loading details...</div>}
                    {error && <div className="text-danger small">Failed to load details.</div>}
                    {!loading && !error && details && sectionType === "visits" && (
                        <VisitDetail detail={details as VisitDetailsDto}/>
                    )}
                    {!loading && !error && details && sectionType === "labExams" && (
                        <LabExamDetail detail={details as LabExamDetailsDto}/>
                    )}
                    {!loading && !error && details && sectionType === "physicalExams" && (
                        <PhysicalExamDetail detail={details as PhysicalExamDetailsDto}/>
                    )}
                </div>
            )}
        </div>
    );
};

export const HistoryListSection = ({title, items, sectionType}: HistoryListSectionProps) => {
    return (
        <div className="mb-3">
            <h6 className="fw-bold mb-2">{title}</h6>
            <div className="border rounded">
                {items.length === 0 ? (
                    <div className="px-3 py-2 text-muted small">No results found</div>
                ) : (
                    items.map((item) => (
                        <HistoryItemRow key={item.id} item={item} sectionType={sectionType}/>
                    ))
                )}
            </div>
        </div>
    );
};

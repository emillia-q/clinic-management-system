export interface VisitHistoryItemDto {
    id: number;
    date: string;
    type: string;
}

export interface PatientHistoryDto {
    visits: VisitHistoryItemDto[];
    physicalExams: VisitHistoryItemDto[];
    labExams: VisitHistoryItemDto[];
}


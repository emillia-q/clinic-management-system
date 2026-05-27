export interface VisitHistoryItemDto {
    id: number;
    date: string;
    type: string;
    examName?: string | null;
}

export interface PatientHistoryDto {
    visits: VisitHistoryItemDto[];
    physicalExams: VisitHistoryItemDto[];
    labExams: VisitHistoryItemDto[];
}

export interface VisitDetailsDto {
    id: number;
    patientName: string;
    socialSecurityNo: string;
    doctorName: string;
    status: string;
    appointmentDate: string;
    description: string | null;
    diagnosis: string | null;
    physicalExams: PhysicalExamDetailsDto[];
    labExams: LabExamDetailsDto[];
}

export interface PhysicalExamDetailsDto {
    id: number;
    visitId: number;
    patientId: number;
    doctorId: number;
    examCode: string;
    examName: string;
    result: string | null;
    date: string;
    patientName: string;
    patientPesel: string;
    doctorName: string;
}

export interface LabExamDetailsDto {
    id: number;
    examCode: string;
    examName: string;
    patientName: string;
    patientPesel: string;
    orderedByDoctor: string;
    orderDate: string;
    completionDate: string | null;
    status: string;
    result: string | null;
    doctorNotes: string | null;
    managerNotes: string | null;
    labTechnicianName: string | null;
    labManagerName: string | null;
    doctorId: number;
    patientId: number;
}

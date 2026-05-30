export interface LabExamDetails {
    id: number;
    examCode: string;
    examName: string;
    patientName: string;
    patientPesel: string;
    orderedByDoctor: string;
    orderDate: string;
    completionDate: string | null;
    approvalRejectionDate: string | null;
    status: string;
    result: string;
    doctorNotes: string;
    managerNotes: string;
    labTechnicianName: string | null;
    labManagerName: string | null;
    doctorId: number;
    patientId: number;
}
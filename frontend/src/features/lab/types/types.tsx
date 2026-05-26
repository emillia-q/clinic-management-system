export interface LabExamDetails {
    id: number;
    examCode: string;
    examName: string;
    patientName: string;
    patientPesel: string;
    orderedByDoctor: string;
    orderDate: string; // ISO-8601 string format
    completionDate: string; // ISO-8601 string format
    status: string;
    result: string;
    doctorNotes: string;
    managerNotes: string;
    labTechnicianId: number;
    labManagerId: number;
    doctorId: number;
    patientId: number;
}
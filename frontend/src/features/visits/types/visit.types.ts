export interface VisitDto {
    id: number;
    patientId?: number;
    doctorId?: number;
    patientName: string;
    socialSecurityNo: string;
    doctorName: string;
    status: string;
    appointmentDate: string;
    description: string;
    diagnosis: string;
}


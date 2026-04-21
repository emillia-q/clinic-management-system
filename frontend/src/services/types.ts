export interface StaffDto {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    userType: string;
    isActive: string;
    passwdChangeRequired: string;
    licenseNo: string | null;
}

export interface StaffListDto {
    id: number;
    firstName: string;
    lastName: string;
    userType: string;
    isActive: string;
}

export interface StaffCreatedDto extends StaffDto {
    temporaryPasswd: string;
}

export interface AddressDto {
    city: string;
    street: string;
    houseNo: string;
    flatNumber?: string;
    postalCode: string;
}

export interface PatientDto {
    id: number;
    firstName: string;
    lastName: string;
    socialSecurityNo: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    address: AddressDto;
}

export interface PatientGeneralDto {
    id: number;
    firstName: string;
    lastName: string;
    socialSecurityNo: string;
    dateOfBirth: string;
}

export interface AddPatientRequest {
    firstName: string;
    lastName: string;
    socialSecurityNo: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    address: AddressDto;
}

export interface VisitDto {
    id: number;
    patientName: string;
    socialSecurityNo: string;
    doctorName: string;
    status: string; // "Registered", "Cancelled", itd.
    appointmentDate: string; // LocalDateTime przychodzi jako ISO String
    description: string;
    diagnosis: string;
}
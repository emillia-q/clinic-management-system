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

export interface PatientUpcomingVisitDto {
    patient: PatientDto;
    upcomingVisit: string;
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


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
    temporaryPassword: string;
}

export interface AddStaffRequest {
    firstName: string;
    lastName: string;
    userType: string;
    licenseNo?: string;
}


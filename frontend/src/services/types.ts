export interface StaffDto{
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    userType: string;
    isActive: string;
    licenseNo: string;
}

export interface StaffCreatedDto extends StaffDto{
    temporaryPasswd: string;
}
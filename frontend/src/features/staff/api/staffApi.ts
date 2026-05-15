import type {AddStaffRequest, StaffCreatedDto, StaffDto, StaffListDto} from "../types/staff.types.ts";
import {apiClient} from "../../../shared/api/client.ts";

const STAFF_BASE_PATH = "/staff";

const mapTabToUserType = (tab?: string): string | undefined => {
    switch (tab) {
        case "Administrators":
            return "Administrator";
        case "Doctors":
            return "Doctor";
        case "Receptionists":
            return "Receptionist";
        case "Lab Technicians":
            return "LabTechnician";
        case "Lab Managers":
            return "LabManager";
        default:
            return undefined;
    }
};

export const staffApi = {
    getStaffList: async (type?: string, query: string = ""): Promise<StaffListDto[]> => {
        const params = new URLSearchParams();
        params.append("query", query);
        const mappedType = mapTabToUserType(type);
        if (mappedType) {
            params.append("type", mappedType);
        }

        const response = await apiClient.get<StaffListDto[]>(`${STAFF_BASE_PATH}?${params.toString()}`);
        return Array.isArray(response.data) ? response.data : [];
    },

    toggleActive: async (id: number): Promise<void> => {
        await apiClient.patch(`${STAFF_BASE_PATH}/${id}/active`);
    },

    getById: async (id: number): Promise<StaffDto> => {
        const response = await apiClient.get<StaffDto>(`${STAFF_BASE_PATH}/${id}`);
        return response.data;
    },

    createStaff: async (data: AddStaffRequest): Promise<StaffCreatedDto> => {
        const response = await apiClient.post<StaffCreatedDto>(STAFF_BASE_PATH, data);
        return response.data;
    }
};


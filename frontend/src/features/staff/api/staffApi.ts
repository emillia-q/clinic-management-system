import type {StaffDto, StaffListDto} from "../types/staff.types.ts";
import {apiClient} from "../../../shared/api/client.ts";

const STAFF_BASE_PATH = "/admin";

export const staffApi = {
    getStaffList: async (type?: string, query: string = ""): Promise<StaffListDto[]> => {
        const params = new URLSearchParams();
        params.append("query", query);
        if (type && type !== "All") {
            params.append("type", type);
        }

        const response = await apiClient.get<StaffListDto[]>(`${STAFF_BASE_PATH}/list?${params.toString()}`);
        return Array.isArray(response.data) ? response.data : [];
    },

    toggleActive: async (id: number): Promise<void> => {
        await apiClient.patch(`${STAFF_BASE_PATH}/${id}/active`);
    },

    getById: async (id: number): Promise<StaffDto> => {
        const response = await apiClient.get<StaffDto>(`${STAFF_BASE_PATH}/${id}`);
        return response.data;
    }
};


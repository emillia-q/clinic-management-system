import axios from 'axios';
import type {StaffDto, StaffListDto} from "./types.ts";

const BASE_URL = `${import.meta.env.VITE_API_URL}/admin`;

const API = axios.create({
    baseURL: BASE_URL
});

export const adminService = {
    getStaffList: async (type?: string, query: string = ""): Promise<StaffListDto[]> => {
        // Build params
        const params = new URLSearchParams();
        params.append('query', query);
        if (type && type !== 'All') {
            params.append('type', type);
        }
        const response = await API.get<StaffListDto[]>(`/list?${params.toString()}`);
        return response.data;
    },

    toggleActive: async (id: number): Promise<void> => {
        await API.patch(`/${id}/active`);
    },

    getById: async (id: number): Promise<StaffDto> => {
        const response = await API.get<StaffDto>(`/${id}`);
        return response.data;
    }
}
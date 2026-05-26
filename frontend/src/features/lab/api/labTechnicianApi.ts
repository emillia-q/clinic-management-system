import {apiClient} from "../../../shared/api/client.ts";
import type {LabExamDetails} from '../types/types.tsx'

const LAB_TECHNICIAN_BASE_PATH = "/lab-technician/exams";


export const labTechnicianApi = {
    getPendingLabExamsList: async (): Promise<LabExamDetails[]> => {
        const response = await apiClient.get<LabExamDetails[]>(`${LAB_TECHNICIAN_BASE_PATH}/pending`);
        return Array.isArray(response.data) ? response.data : [];
    },

    submitResult: async (id: number, result: string): Promise<void> => {
        const requ = await apiClient.patch(`${LAB_TECHNICIAN_BASE_PATH}/${id}/result`, {result});
        console.log(requ.request);
    },

    cancelExam: async (id: number, reason: string): Promise<void> => {
        await apiClient.patch(`${LAB_TECHNICIAN_BASE_PATH}/${id}/cancel`, {reason});
    },
};


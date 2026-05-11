import {apiClient} from "../../../shared/api/client.ts";
import type {PatientHistoryDto} from "../types/patientHistory.types.ts";

const DOCTORS_BASE_PATH = "/doctors";

export const doctorPatientHistoryApi = {
    getPatientHistory: async (patientId: number): Promise<PatientHistoryDto> => {
        const response = await apiClient.get<PatientHistoryDto>(`${DOCTORS_BASE_PATH}/patients/${patientId}/history`);
        return response.data;
    }
};


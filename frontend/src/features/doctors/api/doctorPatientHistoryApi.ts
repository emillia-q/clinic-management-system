import {apiClient} from "../../../shared/api/client.ts";
import type {LabExamDetailsDto, PatientHistoryDto, PhysicalExamDetailsDto, VisitDetailsDto} from "../types/patientHistory.types.ts";

const DOCTORS_BASE_PATH = "/doctors";

export const doctorPatientHistoryApi = {
    getPatientHistory: async (patientId: number): Promise<PatientHistoryDto> => {
        const response = await apiClient.get<PatientHistoryDto>(`${DOCTORS_BASE_PATH}/patients/${patientId}/history`);
        return response.data;
    },

    getVisitDetails: async (visitId: number): Promise<VisitDetailsDto> => {
        const response = await apiClient.get<VisitDetailsDto>(`${DOCTORS_BASE_PATH}/visits/${visitId}`);
        return response.data;
    },

    getLabExamDetails: async (examId: number): Promise<LabExamDetailsDto> => {
        const response = await apiClient.get<LabExamDetailsDto>(`${DOCTORS_BASE_PATH}/lab-exam/${examId}`);
        return response.data;
    },

    getPhysicalExamDetails: async (examId: number): Promise<PhysicalExamDetailsDto> => {
        const response = await apiClient.get<PhysicalExamDetailsDto>(`${DOCTORS_BASE_PATH}/physical-exam/${examId}`);
        return response.data;
    },
};


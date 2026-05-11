import {useEffect, useState} from "react";
import axios from "axios";
import {doctorPatientHistoryApi} from "../api/doctorPatientHistoryApi.ts";
import type {PatientHistoryDto} from "../types/patientHistory.types.ts";

const EMPTY_HISTORY: PatientHistoryDto = {
    visits: [],
    physicalExams: [],
    labExams: []
};

export const useDoctorPatientHistory = (patientId: number) => {
    const [history, setHistory] = useState<PatientHistoryDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [historyUnavailable, setHistoryUnavailable] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setHistoryUnavailable(false);
            try {
                const data = await doctorPatientHistoryApi.getPatientHistory(patientId);
                setHistory(data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 204) {
                    setHistory(EMPTY_HISTORY);
                } else if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setHistoryUnavailable(true);
                    setHistory(EMPTY_HISTORY);
                } else {
                    console.error("Error fetching patient history:", error);
                    setHistory(EMPTY_HISTORY);
                }
            } finally {
                setIsLoading(false);
            }
        };

        void fetchHistory();
    }, [patientId]);

    return {
        history,
        isLoading,
        historyUnavailable
    };
};


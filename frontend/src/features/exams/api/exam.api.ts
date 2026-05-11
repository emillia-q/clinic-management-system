import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/doctors'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const orderExam = async (type: string, data: any) => {
    const isLab = type === 'Laboratory';
    const endpoint = isLab ? '/lab-exam' : '/physical-exam';

    const payload = isLab
        ? {
            visitId: data.visitId,
            examCode: data.examName,
            doctorNotes: data.notes
        }
        : {
            visitId: data.visitId,
            examCode: data.examName,
            result: data.notes
        };

    const response = await api.post(endpoint, payload);
    return response.data;
};
import {normalizeStatusKey} from './normalizeStatusKey';

/** LabExamStatus: Ordered, Completed, Validated, Rejected, Canceled */
export const getLabExamStatusBadgeClass = (status: string): string => {
    switch (normalizeStatusKey(status)) {
        case 'ordered':
            return 'badge bg-primary text-white';
        case 'completed':
            return 'badge status-badge-lab-completed';
        case 'validated':
            return 'badge bg-success text-white';
        case 'rejected':
            return 'badge bg-danger text-white';
        case 'cancelled':
        case 'canceled':
            return 'badge status-badge-lab-canceled';
        default:
            return 'badge bg-secondary text-white';
    }
};

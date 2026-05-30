import {normalizeStatusKey} from './normalizeStatusKey';

/** VisitStatus: Registered, In Progress, Finished, Cancelled */
export const getVisitStatusBadgeClass = (status: string): string => {
    switch (normalizeStatusKey(status)) {
        case 'registered':
            return 'badge bg-primary text-white';
        case 'in_progress':
        case 'inprogress':
            return 'badge status-badge-visit-in-progress';
        case 'finished':
            return 'badge bg-success text-white';
        case 'cancelled':
        case 'canceled':
            return 'badge bg-danger text-white';
        default:
            return 'badge bg-secondary text-white';
    }
};

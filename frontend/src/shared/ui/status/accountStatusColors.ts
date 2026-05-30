import {normalizeStatusKey} from './normalizeStatusKey';

/** Account active flag: Y / N or Active / Inactive */
export const getAccountStatusBadgeClass = (status: string): string => {
    switch (normalizeStatusKey(status)) {
        case 'active':
        case 'y':
            return 'badge bg-success text-white';
        case 'inactive':
        case 'n':
            return 'badge bg-secondary text-white';
        default:
            return 'badge bg-secondary text-white';
    }
};

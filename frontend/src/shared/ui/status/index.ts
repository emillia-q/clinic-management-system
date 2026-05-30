import type {StatusDomain} from './normalizeStatusKey';
import {getAccountStatusBadgeClass} from './accountStatusColors';
import {getLabExamStatusBadgeClass} from './labExamStatusColors';
import {getVisitStatusBadgeClass} from './visitStatusColors';

export const getStatusBadgeClass = (status: string, domain: StatusDomain): string => {
    switch (domain) {
        case 'visit':
            return getVisitStatusBadgeClass(status);
        case 'labExam':
            return getLabExamStatusBadgeClass(status);
        case 'account':
            return getAccountStatusBadgeClass(status);
    }
};

export {normalizeStatusKey, LAB_MANAGER_TAB_LABELS} from './normalizeStatusKey';
export type {StatusDomain} from './normalizeStatusKey';
export {getVisitStatusBadgeClass} from './visitStatusColors';
export {getLabExamStatusBadgeClass} from './labExamStatusColors';
export {getAccountStatusBadgeClass} from './accountStatusColors';

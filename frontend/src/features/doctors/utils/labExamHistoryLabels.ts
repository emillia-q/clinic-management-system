import {normalizeStatusKey} from '../../../shared/ui/status';

export interface LabExamHistoryLabels {
    executionDateLabel: string;
    executorLabel: string;
    showManagerReview: boolean;
    managerActionDateLabel: string | null;
    managerActionByLabel: string | null;
}

export const getLabExamHistoryLabels = (status: string): LabExamHistoryLabels => {
    const key = normalizeStatusKey(status);

    if (key === 'cancelled' || key === 'canceled') {
        return {
            executionDateLabel: 'Canceled on',
            executorLabel: 'Canceled by',
            showManagerReview: false,
            managerActionDateLabel: null,
            managerActionByLabel: null,
        };
    }

    if (key === 'validated') {
        return {
            executionDateLabel: 'Completed on',
            executorLabel: 'Completed by',
            showManagerReview: true,
            managerActionDateLabel: 'Approved on',
            managerActionByLabel: 'Approved by',
        };
    }

    if (key === 'rejected') {
        return {
            executionDateLabel: 'Completed on',
            executorLabel: 'Completed by',
            showManagerReview: true,
            managerActionDateLabel: 'Rejected on',
            managerActionByLabel: 'Rejected by',
        };
    }

    return {
        executionDateLabel: 'Completed on',
        executorLabel: 'Completed by',
        showManagerReview: false,
        managerActionDateLabel: null,
        managerActionByLabel: null,
    };
};

export const normalizeStatusKey = (status: string): string =>
    (status || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/-/g, '_');

export type StatusDomain = 'visit' | 'labExam' | 'account';

export const LAB_MANAGER_TAB_LABELS: Record<string, string> = {
    Completed: 'Completed (To Verify)',
};

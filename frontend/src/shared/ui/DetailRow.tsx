import type {ReactNode} from 'react';

interface DetailRowProps {
    label: string;
    value: ReactNode;
}

export const DetailRow = ({label, value}: DetailRowProps) => (
    <div className="d-flex gap-2 mb-1 small">
        <span className="text-muted" style={{minWidth: '140px'}}>{label}:</span>
        <span className="fw-medium">{value ?? '—'}</span>
    </div>
);

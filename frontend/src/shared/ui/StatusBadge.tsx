import type {StatusDomain} from './status';
import {getStatusBadgeClass} from './status';

interface StatusBadgeProps {
    status: string;
    domain: StatusDomain;
    className?: string;
    uppercase?: boolean;
    padded?: boolean;
    label?: string;
}

export const StatusBadge = ({
    status,
    domain,
    className = '',
    uppercase = false,
    padded = true,
    label,
}: StatusBadgeProps) => {
    const display = label ?? status;
    const text = uppercase ? display.toUpperCase() : display;

    return (
        <span className={`${getStatusBadgeClass(status, domain)} ${padded ? 'py-2 px-3' : ''} ${className}`.trim()}>
            {text}
        </span>
    );
};

export type {StatusDomain};

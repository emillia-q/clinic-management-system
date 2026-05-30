import type {ReactNode} from 'react';
import {FIELD_LABEL_CLASS, FIELD_LABEL_STYLE} from './styles';

interface DetailFieldLabelProps {
    children: ReactNode;
    className?: string;
}

export const DetailFieldLabel = ({children, className = ''}: DetailFieldLabelProps) => (
    <small className={`${FIELD_LABEL_CLASS} ${className}`.trim()} style={FIELD_LABEL_STYLE}>
        {children}
    </small>
);

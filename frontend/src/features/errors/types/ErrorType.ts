
export interface InvalidParametersErrorDetails {
    timestamp: string;
    message: string;
    errors?: Map<string,string>;
}

export interface ValidationErrorDetails {
    timestamp: string;
    message: string;
    errors?: Record<string, string>;
}

export interface InvalidParametersErrorDetails {
    timestamp: string;
    message: string;
    errors?: Map<string,string>;
}
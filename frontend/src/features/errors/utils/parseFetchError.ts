import type {ValidationErrorDetails} from "../types/ErrorType.ts";

export async function parseFetchError(response: Response): Promise<string> {
    const text = await response.text();
    if (!text) {
        return `Request failed (${response.status})`;
    }

    try {
        const data = JSON.parse(text) as ValidationErrorDetails & { message?: string };
        if (data.errors && Object.keys(data.errors).length > 0) {
            return Object.entries(data.errors)
                .map(([field, message]) => `${field}: ${message}`)
                .join("; ");
        }
        return data.message || text;
    } catch {
        return text;
    }
}

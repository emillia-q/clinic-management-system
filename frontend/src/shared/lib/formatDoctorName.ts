const DOCTOR_PREFIX = /^dr\.?\s+/i;

export function stripDoctorPrefix(name: string): string {
    return name.replace(DOCTOR_PREFIX, "").trim();
}

export function formatDoctorName(firstName: string, lastName: string): string {
    return `Dr ${firstName} ${lastName}`;
}

export function formatDoctorFromFullName(fullName: string): string {
    return `Dr ${stripDoctorPrefix(fullName)}`;
}

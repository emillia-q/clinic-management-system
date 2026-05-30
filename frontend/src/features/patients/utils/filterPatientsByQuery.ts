interface SearchablePatient {
    firstName: string;
    lastName: string;
    socialSecurityNo: string;
}

export const filterPatientsByQuery = <T extends SearchablePatient>(
    patients: T[],
    query: string | null | undefined,
): T[] => {
    const trimmed = query?.trim();
    if (!trimmed) {
        return patients;
    }

    const normalizedQuery = trimmed.toLowerCase();
    return patients.filter((patient) => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        return (
            fullName.includes(normalizedQuery) ||
            patient.firstName.toLowerCase().includes(normalizedQuery) ||
            patient.lastName.toLowerCase().includes(normalizedQuery) ||
            patient.socialSecurityNo.toLowerCase().includes(normalizedQuery)
        );
    });
};

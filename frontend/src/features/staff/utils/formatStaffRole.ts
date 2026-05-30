const ROLE_LABELS: Record<string, string> = {
    Administrator: "Administrator",
    Doctor: "Doctor",
    Receptionist: "Receptionist",
    LabTechnician: "Lab Technician",
    LabManager: "Lab Manager",
};

export const formatStaffRole = (role?: string | null): string => {
    if (!role) {
        return "Guest";
    }
    return ROLE_LABELS[role] ?? role;
};

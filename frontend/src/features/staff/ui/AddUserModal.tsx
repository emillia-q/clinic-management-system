import {useState} from "react";
import type {AddStaffRequest, StaffCreatedDto} from "../types/staff.types.ts";
import {staffApi} from "../api/staffApi.ts";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

const USER_TYPES = [
    {value: "Doctor", label: "Doctor"},
    {value: "Receptionist", label: "Receptionist"},
    {value: "LabTechnician", label: "Lab Technician"},
    {value: "LabManager", label: "Lab Manager"},
    {value: "Administrator", label: "Administrator"},
];

type Step = "form" | "credentials";

export const AddUserModal = ({isOpen, onClose, onUserCreated}: AddUserModalProps) => {
    const [step, setStep] = useState<Step>("form");
    const [form, setForm] = useState<AddStaffRequest>({
        firstName: "",
        lastName: "",
        userType: "",
        licenseNo: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof AddStaffRequest, string>>>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [createdUser, setCreatedUser] = useState<StaffCreatedDto | null>(null);

    if (!isOpen) return null;

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof AddStaffRequest, string>> = {};
        if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
        if (!form.userType) newErrors.userType = "Role is required.";
        if (form.userType === "Doctor" && !form.licenseNo?.trim()) {
            newErrors.licenseNo = "License number is required for doctors.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof AddStaffRequest, value: string) => {
        setForm(prev => ({...prev, [field]: value}));
        if (errors[field]) setErrors(prev => ({...prev, [field]: undefined}));
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        setApiError(null);
        try {
            const payload: AddStaffRequest = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                userType: form.userType,
            };
            if (form.userType === "Doctor" && form.licenseNo?.trim()) {
                payload.licenseNo = form.licenseNo.trim();
            }
            const result = await staffApi.createStaff(payload);
            setCreatedUser(result);
            setStep("credentials");
            onUserCreated();
        } catch (err: unknown) {
            const error = err as {response?: {data?: {message?: string}}};
            setApiError(error?.response?.data?.message ?? "Failed to create user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep("form");
        setForm({firstName: "", lastName: "", userType: "", licenseNo: ""});
        setErrors({});
        setApiError(null);
        setCreatedUser(null);
        onClose();
    };

    const roleLabel = USER_TYPES.find(t => t.value === createdUser?.userType)?.label ?? createdUser?.userType;

    return (
        <div
            className="modal d-block"
            tabIndex={-1}
            style={{backgroundColor: "rgba(0,0,0,0.55)"}}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">

                    {step === "form" && (
                        <>
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    <i className="fa-solid fa-user-plus me-2 text-primary"></i>
                                    Add New User
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={onClose}
                                    disabled={loading}
                                />
                            </div>

                            <div className="modal-body pt-3">
                                {apiError && (
                                    <div className="alert alert-danger py-2 small">{apiError}</div>
                                )}

                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold small">First Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                                            placeholder="e.g. Anna"
                                            value={form.firstName}
                                            onChange={e => handleChange("firstName", e.target.value)}
                                            disabled={loading}
                                        />
                                        {errors.firstName && (
                                            <div className="invalid-feedback">{errors.firstName}</div>
                                        )}
                                    </div>

                                    <div className="col-6">
                                        <label className="form-label fw-semibold small">Last Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                            placeholder="e.g. Nowak"
                                            value={form.lastName}
                                            onChange={e => handleChange("lastName", e.target.value)}
                                            disabled={loading}
                                        />
                                        {errors.lastName && (
                                            <div className="invalid-feedback">{errors.lastName}</div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold small">Role</label>
                                        <select
                                            className={`form-select ${errors.userType ? "is-invalid" : ""}`}
                                            value={form.userType}
                                            onChange={e => handleChange("userType", e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="">— Select role —</option>
                                            {USER_TYPES.map(t => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>
                                        {errors.userType && (
                                            <div className="invalid-feedback">{errors.userType}</div>
                                        )}
                                    </div>

                                    {form.userType === "Doctor" && (
                                        <div className="col-12">
                                            <label className="form-label fw-semibold small">
                                                License Number
                                                <span className="text-danger ms-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.licenseNo ? "is-invalid" : ""}`}
                                                placeholder="Max 7 characters"
                                                maxLength={7}
                                                value={form.licenseNo}
                                                onChange={e => handleChange("licenseNo", e.target.value)}
                                                disabled={loading}
                                            />
                                            {errors.licenseNo && (
                                                <div className="invalid-feedback">{errors.licenseNo}</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer border-top-0 pt-0">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading
                                        ? <><span className="spinner-border spinner-border-sm me-2"/>Creating...</>
                                        : <><i className="fa-solid fa-user-plus me-2"/>Register</>
                                    }
                                </button>
                            </div>
                        </>
                    )}

                    {step === "credentials" && createdUser && (
                        <>
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold text-success">
                                    <i className="fa-solid fa-circle-check me-2"></i>
                                    User Created Successfully
                                </h5>
                            </div>

                            <div className="modal-body pt-2">
                                <div
                                    className="alert alert-danger border-2 d-flex align-items-start gap-2 mb-3"
                                    role="alert"
                                >
                                    <i className="fa-solid fa-triangle-exclamation mt-1 flex-shrink-0"></i>
                                    <div>
                                        <strong>Important — save these credentials now!</strong>
                                        <br/>
                                        After clicking <strong>Back</strong>, the temporary password will
                                        <strong> NOT be shown again</strong>. Copy and pass it to the new employee.
                                    </div>
                                </div>

                                <div className="card border-0 bg-light rounded-3 p-3">
                                    <table className="table table-sm table-borderless mb-0 small">
                                        <tbody>
                                        <tr>
                                            <td className="fw-semibold text-muted pe-3 py-1" style={{width: "40%"}}>Full Name</td>
                                            <td className="py-1">{createdUser.firstName} {createdUser.lastName}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-semibold text-muted pe-3 py-1">Role</td>
                                            <td className="py-1">{roleLabel}</td>
                                        </tr>
                                        {createdUser.licenseNo && (
                                            <tr>
                                                <td className="fw-semibold text-muted pe-3 py-1">License No.</td>
                                                <td className="py-1">{createdUser.licenseNo}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td className="fw-semibold text-muted pe-3 py-1">Login</td>
                                            <td className="py-1">
                                                <code className="bg-white px-2 py-1 rounded border">{createdUser.login}</code>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="fw-semibold text-muted pe-3 py-1">Temp. Password</td>
                                            <td className="py-1">
                                                <code className="bg-white px-2 py-1 rounded border text-danger fw-bold">{createdUser.temporaryPassword}</code>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="modal-footer border-top-0 pt-0">
                                <button
                                    className="btn btn-secondary px-4"
                                    onClick={handleBack}
                                >
                                    <i className="fa-solid fa-arrow-left me-2"/>
                                    Back
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

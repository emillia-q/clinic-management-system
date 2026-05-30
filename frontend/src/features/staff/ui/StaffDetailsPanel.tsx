import type {StaffDto} from "../types/staff.types.ts";
import {formatStaffRole} from "../utils/formatStaffRole.ts";
import {
    AVATAR_SIZE,
    BTN_PANEL_DANGER,
    BTN_PANEL_SUCCESS,
    DetailFieldLabel,
    FIELD_LABEL_CLASS,
    FIELD_LABEL_STYLE,
    PANEL_TITLE_CLASS,
    TABLE_CARD_CLASS,
} from "../../../shared/ui";

interface StaffDetailsPanelProps {
    selectedStaff: StaffDto | null;
    onRequestStatusChange: () => void;
}

export const StaffDetailsPanel = ({selectedStaff, onRequestStatusChange}: StaffDetailsPanelProps) => {
    return (
        <div className={`${TABLE_CARD_CLASS} border-light`} style={{minHeight: "400px"}}>
            <div className="card-body p-4">
                {selectedStaff ? (
                    <div className="staff-details-panel">
                        <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-4">
                            <div
                                className="d-flex align-items-center justify-content-center bg-light rounded-circle shadow-sm flex-shrink-0"
                                style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
                            >
                                <i className="fa-solid fa-user-md fa-2x text-primary"></i>
                            </div>
                            <div>
                                <h5 className={`${PANEL_TITLE_CLASS} mb-1 text-dark`}>
                                    {selectedStaff.firstName} {selectedStaff.lastName}
                                </h5>
                                <span
                                    className={`badge py-2 px-3 ${selectedStaff.isActive === "Y" ? "bg-success" : "bg-danger"}`}>
                                    {selectedStaff.isActive === "Y" ? "Active Account" : "Inactive Account"}
                                </span>
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-sm-6">
                                <DetailFieldLabel>Username</DetailFieldLabel>
                                <p className="fw-semibold text-dark mb-0">{selectedStaff.login}</p>
                            </div>
                            <div className="col-sm-6">
                                <DetailFieldLabel>ID Number</DetailFieldLabel>
                                <p className="fw-semibold text-dark mb-0">#{selectedStaff.id}</p>
                            </div>
                            <div className="col-sm-6">
                                <DetailFieldLabel>Role</DetailFieldLabel>
                                <p className="mb-0">
                                    <span className="badge py-2 px-3 bg-primary text-white">
                                        {formatStaffRole(selectedStaff.userType)}
                                    </span>
                                </p>
                            </div>
                            {selectedStaff.licenseNo && (
                                <div className="col-sm-6">
                                    <label className={FIELD_LABEL_CLASS} style={FIELD_LABEL_STYLE}>License Number</label>
                                    <p className="fw-semibold text-dark mb-0">{selectedStaff.licenseNo}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 border-top pt-4 text-end">
                            <button
                                onClick={onRequestStatusChange}
                                className={`${selectedStaff.isActive === "Y" ? BTN_PANEL_DANGER : BTN_PANEL_SUCCESS}`}
                            >
                                <i className={`fa-solid ${selectedStaff.isActive === "Y" ? "fa-user-slash" : "fa-user-check"} me-2`}></i>
                                {selectedStaff.isActive === "Y" ? "Deactivate Account" : "Activate Account"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted py-5">
                        <i className="fa-solid fa-address-card fa-4x mb-3 opacity-25"></i>
                        <p className="mb-0">Select a staff member to see details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

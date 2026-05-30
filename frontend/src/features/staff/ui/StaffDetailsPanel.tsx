import type {StaffDto} from "../types/staff.types.ts";
import {formatStaffRole} from "../utils/formatStaffRole.ts";

interface StaffDetailsPanelProps {
    selectedStaff: StaffDto | null;
    onRequestStatusChange: () => void;
}

export const StaffDetailsPanel = ({selectedStaff, onRequestStatusChange}: StaffDetailsPanelProps) => {
    return (
        <div className="card shadow-sm border-light" style={{minHeight: "400px"}}>
            <div className="card-body p-4 p-lg-5">
                {selectedStaff ? (
                    <div className="staff-details-panel">
                        <div className="d-flex align-items-center gap-4 mb-4 border-bottom pb-4">
                            <div
                                className="d-flex align-items-center justify-content-center bg-light rounded-circle shadow-sm flex-shrink-0"
                                style={{width: "88px", height: "88px"}}
                            >
                                <i className="fa-solid fa-user-md fa-3x text-primary"></i>
                            </div>
                            <div>
                                <h2 className="mb-2 fw-bold display-6">
                                    {selectedStaff.firstName} {selectedStaff.lastName}
                                </h2>
                                <span
                                    className={`badge fs-6 px-3 py-2 ${selectedStaff.isActive === "Y" ? "bg-success" : "bg-danger"}`}>
                                    {selectedStaff.isActive === "Y" ? "Active Account" : "Inactive Account"}
                                </span>
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-sm-6">
                                <label className="text-muted d-block mb-1 fs-6 text-uppercase fw-semibold">Username</label>
                                <p className="fs-5 fw-semibold text-dark mb-0">{selectedStaff.login}</p>
                            </div>
                            <div className="col-sm-6">
                                <label className="text-muted d-block mb-1 fs-6 text-uppercase fw-semibold">ID Number</label>
                                <p className="fs-5 fw-semibold text-dark mb-0">#{selectedStaff.id}</p>
                            </div>
                            <div className="col-sm-6">
                                <label className="text-muted d-block mb-1 fs-6 text-uppercase fw-semibold">Role</label>
                                <p className="mb-0">
                                    <span className="badge fs-6 px-3 py-2 bg-primary text-white">
                                        {formatStaffRole(selectedStaff.userType)}
                                    </span>
                                </p>
                            </div>
                            {selectedStaff.licenseNo && (
                                <div className="col-sm-6">
                                    <label className="text-muted d-block mb-1 fs-6 text-uppercase fw-semibold">License Number</label>
                                    <p className="fs-5 fw-semibold text-dark mb-0">{selectedStaff.licenseNo}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-5 border-top pt-4 text-end">
                            <button
                                onClick={onRequestStatusChange}
                                className={`btn btn-lg ${selectedStaff.isActive === "Y" ? "btn-outline-danger" : "btn-success"}`}
                            >
                                <i className={`fa-solid ${selectedStaff.isActive === "Y" ? "fa-user-slash" : "fa-user-check"} me-2`}></i>
                                {selectedStaff.isActive === "Y" ? "Deactivate Account" : "Activate Account"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted py-5">
                        <i className="fa-solid fa-address-card fa-4x mb-3 opacity-25"></i>
                        <p className="fs-5 mb-0">Select a staff member to see details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


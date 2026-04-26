import type {StaffDto} from "../types/staff.types.ts";

interface StaffDetailsPanelProps {
    selectedStaff: StaffDto | null;
    onRequestStatusChange: () => void;
}

export const StaffDetailsPanel = ({selectedStaff, onRequestStatusChange}: StaffDetailsPanelProps) => {
    return (
        <div className="card shadow-sm border-light" style={{flex: 1, minHeight: "400px"}}>
            <div className="card-body p-4">
                {selectedStaff ? (
                    <div>
                        <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                            <div
                                className="d-flex align-items-center justify-content-center bg-light rounded-circle shadow-sm"
                                style={{width: "70px", height: "70px"}}
                            >
                                <i className="fa-solid fa-user-md fa-2x text-primary"></i>
                            </div>
                            <div>
                                <h2 className="mb-0 fw-bold">{selectedStaff.firstName} {selectedStaff.lastName}</h2>
                                <span
                                    className={`badge ${selectedStaff.isActive === "Y" ? "bg-success" : "bg-danger"}`}>
                                    {selectedStaff.isActive === "Y" ? "Active Account" : "Inactive Account"}
                                </span>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-sm-6">
                                <label className="text-muted small d-block">Username</label>
                                <p className="fw-medium text-dark">{selectedStaff.login}</p>
                            </div>
                            <div className="col-sm-6">
                                <label className="text-muted small d-block">ID Number</label>
                                <p className="fw-medium text-dark">#{selectedStaff.id}</p>
                            </div>
                            <div className="col-sm-6">
                                <label className="text-muted small d-block">Role</label>
                                <p className="fw-medium text-dark">
                                    <span className="badge bg-info text-dark">{selectedStaff.userType}</span>
                                </p>
                            </div>
                            {selectedStaff.licenseNo && (
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block">License Number</label>
                                    <p className="fw-medium text-dark">{selectedStaff.licenseNo}</p>
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
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                        <i className="fa-solid fa-address-card fa-4x mb-3 opacity-25"></i>
                        <p>Select a staff member to see details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


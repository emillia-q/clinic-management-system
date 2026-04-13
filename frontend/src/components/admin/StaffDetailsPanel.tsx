import type { StaffDto } from "../../services/types.ts";

interface StaffDetailsPanelProps {
    selectedStaff: StaffDto | null;
    onRequestStatusChange: () => void;
}

export const StaffDetailsPanel = ({ selectedStaff, onRequestStatusChange }: StaffDetailsPanelProps) => {
    return (
        <div style={{ flex: 1, border: "1px solid #eee", padding: "10px", minHeight: "400px" }}>
            {selectedStaff ? (
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "#ddd"
                            }}
                        ></div>
                        <h2>
                            {selectedStaff.firstName} {selectedStaff.lastName}
                        </h2>
                    </div>

                    <p>
                        <strong>Username:</strong> {selectedStaff.login}
                    </p>
                    <p>
                        <strong>ID:</strong> {selectedStaff.id}
                    </p>
                    <p>
                        <strong>Role:</strong> {selectedStaff.userType}
                    </p>
                    {selectedStaff.licenseNo && (
                        <p>
                            <strong>License Number:</strong> {selectedStaff.licenseNo}
                        </p>
                    )}
                    <p>
                        <strong>Password:</strong> ********
                    </p>

                    <div style={{ marginTop: "40px" }}>
                        <button onClick={onRequestStatusChange} style={{ padding: "10px 20px", cursor: "pointer" }}>
                            {selectedStaff.isActive === "Y" ? "Deactivate Account" : "Activate Account"}
                        </button>
                    </div>
                </div>
            ) : (
                <p style={{ color: "#888" }}>Select a staff member to see details.</p>
            )}
        </div>
    );
};

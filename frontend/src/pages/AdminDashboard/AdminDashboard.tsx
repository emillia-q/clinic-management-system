import {useState, useEffect} from "react";
import {adminService} from "../../services/adminService.ts";
import type {StaffDto} from "../../services/types.ts";

export const AdminDashboard = () => {
    // State
    const [selectedStaff, setSelectedStaff] = useState<StaffDto | null>(null);
    // List of staff members fetched from the backend
    const [staffList, setStaffList] = useState<StaffDto[]>([]);
    // Currently selected tab for filtering (defaults to "All")
    const [activeTab, setActiveTab] = useState<string>("All");
    //
    const [searchQuery, setSearchQuery] = useState("");
    //
    const [showConfirm, setShowConfirm] = useState(false);

    // loadStaff each time the site is entered
    useEffect(() => {
        loadStaff();
    }, [activeTab]);

    // Fun triggered by search btn
    const handleSearch = () => {
        loadStaff();
    };

    // Fetches staff data from the API based on the active tab
    const loadStaff = async () => {
        try {
            const data = await adminService.getStaffList(activeTab, searchQuery);
            setStaffList(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Fetches data for selected user
    const handleSelectStaff = async (id: number) => {
        try {
            const details = await adminService.getById(id);
            setSelectedStaff(details);
        } catch (error) {
            console.error("Error fetching details", error);
        }
    };

    // Toggles account state
    const toggleAccountStatus = async () => {
        if (selectedStaff) {
            await adminService.toggleActive(selectedStaff.id);
            // Po zmianie odświeżamy dane
            const updated = await adminService.getById(selectedStaff.id);
            setSelectedStaff(updated); // Update details view
            loadStaff();               // Update list -> the dot changes color
            setShowConfirm(false);     // Close window
        }
    };

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "20px", padding: "20px"}}>
            {/* search section */}
            <div style={{display: "flex", gap: "10px"}}>
                <input
                    type="text"
                    placeholder="Search Staff"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{padding: '10px', width: '300px'}}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {/* tabs section */}
            <div className="tabs">
                {["All", "Doctor", "Receptionist", "LabTechnician", "LabManager"].map(role => (
                    <button
                        key={role}
                        onClick={() => setActiveTab(role)}
                        style={{fontWeight: activeTab === role ? "bold" : "normal"}}
                    >
                        {role}
                    </button>
                ))}
            </div>

            <div style={{display: "flex", gap: "40px", alignItems: "flex-start"}}>
                {/* staff list */}
                <div style={{flex: 1, border: "1px solid #ccc", padding: "10px", minHeight: "400px"}}>
                    <ul style={{listStyle: "none", padding: 0}}>
                        {staffList.map(s => (
                            <li
                                key={s.id}
                                onClick={() => handleSelectStaff(s.id)} // Fetch user details
                                style={{
                                    cursor: "pointer",
                                    marginBottom: "5px",
                                    borderBottom: "1px solid #eee",
                                    backgroundColor: selectedStaff?.id === s.id ? "#f0f0f0" : "transparent"
                                }}>
                                {s.firstName} {s.lastName}
                                <span style={{color: s.isActive === "Y" ? "green" : "red", marginLeft: "10px"}}>
                                    ({s.isActive === "Y" ? "Active" : "Inactive"})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* detail panel */}
                <div style={{flex: 1, border: "1px solid #eee", padding: "10px", minHeight: "400px"}}>
                    {selectedStaff ? (
                        <div>
                            <div style={{display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px"}}>
                                {/* Placeholder for user img */}
                                <div style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    backgroundColor: "#ddd"
                                }}></div>
                                <h2>{selectedStaff.firstName} {selectedStaff.lastName}</h2>
                            </div>

                            <p><strong>Username:</strong> {selectedStaff.login}</p>
                            <p><strong>ID:</strong> {selectedStaff.id}</p>
                            <p><strong>Role:</strong> {selectedStaff.userType}</p>
                            {selectedStaff.licenseNo &&
                                <p><strong>License Number:</strong> {selectedStaff.licenseNo}</p>}
                            <p><strong>Password:</strong> ********</p>

                            <div style={{marginTop: "40px"}}>
                                {/* Change status panel */}
                                <button
                                    onClick={toggleAccountStatus}
                                    style={{padding: "10px 20px", cursor: "pointer"}}
                                >
                                    {selectedStaff.isActive === "Y" ? "Deactivate Account" : "Activate Account"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p style={{color: "#888"}}>Select a staff member to see details.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
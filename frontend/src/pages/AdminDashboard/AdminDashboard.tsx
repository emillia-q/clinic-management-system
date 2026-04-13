import { useState, useEffect } from "react";
import {adminService} from "../../services/adminService.ts";
import type {StaffDto} from "../../services/types.ts";

export const AdminDashboard = () => {
    // List of staff members fetched from the backend
    const [staffList, setStaffList] = useState<StaffDto[]>([]);

    // Currently selected tab for filtering (defaults to "All")
    const [activeTab, setActiveTab] = useState<string>("All");

    // Fetches staff data from the API based on the active tab
    const loadStaff = async () => {
        try{
            const data = await adminService.getStaffList(activeTab);
            setStaffList(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // loadStaff each time the site is entered
    useEffect(() => {
        loadStaff();
    },[activeTab]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
            {/* tabs section */}
            <div className="tabs">
                {["All", "Doctor", "Receptionist", "LabTechnician", "LabManager"].map(role => (
                    <button
                        key={role}
                    onClick={()=>setActiveTab(role)}
                    style={{fontWeight: activeTab === role ? "bold" : "normal"}}
                    >
                        {role}
                    </button>
                ))}
            </div>

            <div style={{display: "flex", gap: "40px"}}>
                {/* staff list */}
                <div style={{flex: 1, border: "1px solid #ccc", padding: "10px"}}>
                    <ul>
                        {staffList.map(s=> (
                            <li key={s.id} style={{cursor: "pointer", marginBottom: "5px"}}>
                                {s.firstName} {s.lastName}
                                <span style={{color: s.isActive === "Y" ? "green" : "red"}}>
                                    ({s.isActive})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div style={{flex:1, border:"1px solid #eee", padding: "10px"}}>
                <h3>Staff  Member Details</h3>
            </div>
        </div>
    )
}
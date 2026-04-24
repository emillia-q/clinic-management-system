import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService.ts";
import type { StaffDto, StaffListDto } from "../../services/types.ts";

export const useAdminDashboard = () => {
    // State
    const [selectedStaff, setSelectedStaff] = useState<StaffDto | null>(null); // Full details for the selected row
    const [staffList, setStaffList] = useState<StaffListDto[]>([]); // List of staff members fetched from the backend
    const [activeTab, setActiveTab] = useState<string>("All"); // Currently selected tab for filtering (defaults to "All")
    const [searchQuery, setSearchQuery] = useState(""); // Text used when Search is clicked
    const [showConfirm, setShowConfirm] = useState(false); // Confirmation modal before toggling account status

    // Fetches staff data from the API based on the active tab and current search query
    const loadStaff = async () => {
        try {
            const data = await adminService.getStaffList(activeTab, searchQuery);
            setStaffList(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Reload the list when the tab changes (same as entering the view with a new filter)
    useEffect(() => {
        loadStaff();
    }, [activeTab]);

    // Triggered by the Search button
    const handleSearch = () => {
        loadStaff();
    };

    // Fetches full details for the selected staff member
    const handleSelectStaff = async (id: number) => {
        try {
            const details = await adminService.getById(id);
            setSelectedStaff(details);
        } catch (error) {
            console.error("Error fetching details", error);
        }
    };

    const openStatusChangeConfirmation = () => {
        if (selectedStaff) {
            setShowConfirm(true);
        }
    };

    const closeStatusChangeConfirmation = () => {
        setShowConfirm(false);
    };

    // Toggles active/inactive; then refreshes details and list so the status dot updates
    const toggleAccountStatus = async () => {
        if (!selectedStaff) {
            return;
        }

        await adminService.toggleActive(selectedStaff.id);

        const updated = await adminService.getById(selectedStaff.id);
        setSelectedStaff(updated); // Update detail panel
        await loadStaff(); // Update list (Active/Inactive label)
        setShowConfirm(false); // Close modal
    };

    return {
        selectedStaff,
        staffList,
        activeTab,
        searchQuery,
        showConfirm,
        setActiveTab,
        setSearchQuery,
        handleSearch,
        handleSelectStaff,
        openStatusChangeConfirmation,
        closeStatusChangeConfirmation,
        toggleAccountStatus
    };
};

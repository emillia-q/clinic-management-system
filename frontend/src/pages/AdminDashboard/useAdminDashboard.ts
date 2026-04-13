import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService.ts";
import type { StaffDto, StaffListDto } from "../../services/types.ts";

export const useAdminDashboard = () => {
    const [selectedStaff, setSelectedStaff] = useState<StaffDto | null>(null);
    const [staffList, setStaffList] = useState<StaffListDto[]>([]);
    const [activeTab, setActiveTab] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const loadStaff = async () => {
        try {
            const data = await adminService.getStaffList(activeTab, searchQuery);
            setStaffList(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        loadStaff();
    }, [activeTab]);

    const handleSearch = () => {
        loadStaff();
    };

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

    const toggleAccountStatus = async () => {
        if (!selectedStaff) {
            return;
        }

        await adminService.toggleActive(selectedStaff.id);

        const updated = await adminService.getById(selectedStaff.id);
        setSelectedStaff(updated);
        await loadStaff();
        setShowConfirm(false);
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

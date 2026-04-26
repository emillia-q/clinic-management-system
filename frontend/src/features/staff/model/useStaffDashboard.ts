import {useEffect, useState} from "react";
import {staffApi} from "../api/staffApi.ts";
import type {StaffDto, StaffListDto} from "../types/staff.types.ts";

export const useStaffDashboard = () => {
    const [selectedStaff, setSelectedStaff] = useState<StaffDto | null>(null);
    const [staffList, setStaffList] = useState<StaffListDto[]>([]);
    const [activeTab, setActiveTab] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const loadStaff = async () => {
        try {
            const data = await staffApi.getStaffList(activeTab, searchQuery);
            setStaffList(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        void loadStaff();
    }, [activeTab]);

    const handleSearch = () => {
        void loadStaff();
    };

    const handleSelectStaff = async (id: number) => {
        try {
            const details = await staffApi.getById(id);
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

        await staffApi.toggleActive(selectedStaff.id);
        const updated = await staffApi.getById(selectedStaff.id);
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


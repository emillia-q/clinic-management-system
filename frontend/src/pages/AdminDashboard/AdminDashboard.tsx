import { ConfirmationModal } from "../../components/admin/ConfirmationModal.tsx";
import { StaffDetailsPanel } from "../../components/admin/StaffDetailsPanel.tsx";
import { StaffList } from "../../components/admin/StaffList.tsx";
import { StaffTabs } from "../../components/admin/StaffTabs.tsx";
import { useAdminDashboard } from "./useAdminDashboard.ts";

export const AdminDashboard = () => {
    const {
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
    } = useAdminDashboard();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Search Staff"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: "10px", width: "300px" }}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <StaffTabs activeTab={activeTab} onChangeTab={setActiveTab} />

            <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
                <StaffList
                    staffList={staffList}
                    selectedStaffId={selectedStaff?.id}
                    onSelectStaff={handleSelectStaff}
                />
                <StaffDetailsPanel
                    selectedStaff={selectedStaff}
                    onRequestStatusChange={openStatusChangeConfirmation}
                />
            </div>

            <ConfirmationModal
                isOpen={showConfirm}
                title="Confirm account status change"
                message="Are you sure you want to change this account status?"
                onConfirm={toggleAccountStatus}
                onCancel={closeStatusChangeConfirmation}
            />
        </div>
    );
};
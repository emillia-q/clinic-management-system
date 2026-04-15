import {ConfirmationModal} from "../../components/admin/ConfirmationModal.tsx";
import {StaffDetailsPanel} from "../../components/admin/StaffDetailsPanel.tsx";
import {StaffList} from "../../components/admin/StaffList.tsx";
import {StaffTabs} from "../../components/admin/StaffTabs.tsx";
import {useAdminDashboard} from "./useAdminDashboard.ts";

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
        <div className="container-fluid py-4">

            <div className="row mb-4">
                <div className="col-md-5 col-lg-4">
                    <div className="input-group shadow-sm">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Search Staff..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="btn btn-primary px-4"
                            onClick={handleSearch}
                        >
                            <i className="fa-solid fa-magnifying-glass me-2"></i>
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <StaffTabs activeTab={activeTab} onChangeTab={setActiveTab}/>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-5 col-lg-4">
                    <StaffList
                        staffList={staffList}
                        selectedStaffId={selectedStaff?.id}
                        onSelectStaff={handleSelectStaff}
                    />
                </div>

                <div className="col-md-7 col-lg-8">
                    <StaffDetailsPanel
                        selectedStaff={selectedStaff}
                        onRequestStatusChange={openStatusChangeConfirmation}
                    />
                </div>
            </div>

            <ConfirmationModal
                isOpen={showConfirm}
                title="Confirm Account Update"
                message={`Are you sure you want to change the status of ${selectedStaff?.firstName} ${selectedStaff?.lastName}?`}
                onConfirm={toggleAccountStatus}
                onCancel={closeStatusChangeConfirmation}
            />
        </div>
    );
};
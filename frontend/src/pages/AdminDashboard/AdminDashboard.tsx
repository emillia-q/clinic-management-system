import {useState} from "react";
import {ConfirmationModal} from "../../features/staff/ui/ConfirmationModal.tsx";
import {StaffDetailsPanel} from "../../features/staff/ui/StaffDetailsPanel.tsx";
import {StaffList} from "../../features/staff/ui/StaffList.tsx";
import {StaffTabs} from "../../features/staff/ui/StaffTabs.tsx";
import {useStaffDashboard} from "../../features/staff/model/useStaffDashboard.ts";
import {AddUserModal} from "../../features/staff/ui/AddUserModal.tsx";

export const AdminDashboard = () => {
    const [showAddUser, setShowAddUser] = useState(false);

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
        toggleAccountStatus,
        refreshList,
    } = useStaffDashboard();

    return (
        <div className="container-fluid py-4">

            <div className="row mb-4 align-items-center">
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
                <div className="col-auto ms-auto">
                    <button
                        className="btn btn-success px-4 shadow-sm"
                        onClick={() => setShowAddUser(true)}
                    >
                        <i className="fa-solid fa-user-plus me-2"></i>
                        Add New User
                    </button>
                </div>
            </div>

            <div className="row mb-3">
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

            <AddUserModal
                isOpen={showAddUser}
                onClose={() => setShowAddUser(false)}
                onUserCreated={() => refreshList?.()}
            />
        </div>
    );
};
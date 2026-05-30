import type {StaffListDto} from "../types/staff.types.ts";
import {StaffListItem} from "./StaffListItem.tsx";

interface StaffListProps {
    staffList: StaffListDto[];
    selectedStaffId: number | undefined;
    onSelectStaff: (id: number) => void;
}

const STAFF_LIST_MAX_HEIGHT = "calc(100vh - 17rem)";

export const StaffList = ({staffList, selectedStaffId, onSelectStaff}: StaffListProps) => {
    return (
        <div className="card shadow-sm mb-4">
            <div
                className="card-body p-0 overflow-auto"
                style={{maxHeight: STAFF_LIST_MAX_HEIGHT}}
            >
                {staffList && staffList.length > 0 ? (
                    <ul className="list-group list-group-flush">
                        {staffList.map((staff) => (
                            <StaffListItem
                                key={staff.id}
                                staff={staff}
                                isSelected={selectedStaffId === staff.id}
                                onSelect={onSelectStaff}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted text-center mt-5">No users to display.</p>
                )}
            </div>
        </div>
    );
};


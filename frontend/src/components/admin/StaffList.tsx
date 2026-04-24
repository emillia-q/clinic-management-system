import type {StaffListDto} from "../../services/types.ts";
import {StaffListItem} from "./StaffListItems.tsx";

interface StaffListProps {
    staffList: StaffListDto[];
    selectedStaffId: number | undefined;
    onSelectStaff: (id: number) => void;
}

export const StaffList = ({staffList, selectedStaffId, onSelectStaff}: StaffListProps) => {
    return (
        <div className="card shadow-sm mb-4" style={{minHeight: "400px"}}>
            <div className="card-body p-0">
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
import type { StaffListDto } from "../../services/types.ts";
import { StaffListItem } from "./StaffListItems.tsx";

interface StaffListProps {
    staffList: StaffListDto[];
    selectedStaffId: number | undefined;
    onSelectStaff: (id: number) => void;
}

export const StaffList = ({ staffList, selectedStaffId, onSelectStaff }: StaffListProps) => {
    return (
        <div style={{ flex: 1, border: "1px solid #ccc", padding: "10px", minHeight: "400px" }}>
            {/* Staff list (bordered column) */}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {staffList.map((staff) => (
                    <StaffListItem
                        key={staff.id}
                        staff={staff}
                        isSelected={selectedStaffId === staff.id}
                        onSelect={onSelectStaff}
                    />
                ))}
            </ul>
        </div>
    );
};

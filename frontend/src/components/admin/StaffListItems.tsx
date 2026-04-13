import type { StaffListDto } from "../../services/types.ts";

interface StaffListItemProps {
    staff: StaffListDto;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

export const StaffListItem = ({ staff, isSelected, onSelect }: StaffListItemProps) => {
    return (
        <li
            onClick={() => onSelect(staff.id)}
            style={{
                cursor: "pointer",
                marginBottom: "5px",
                borderBottom: "1px solid #eee",
                backgroundColor: isSelected ? "#f0f0f0" : "transparent"
            }}
        >
            {/* Click loads full staff details in the detail panel */}
            {staff.firstName} {staff.lastName}
            <span style={{ color: staff.isActive === "Y" ? "green" : "red", marginLeft: "10px" }}>
                ({staff.isActive === "Y" ? "Active" : "Inactive"})
            </span>
        </li>
    );
};

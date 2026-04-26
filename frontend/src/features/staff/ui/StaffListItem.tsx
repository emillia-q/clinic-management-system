import type {StaffListDto} from "../types/staff.types.ts";

interface StaffListItemProps {
    staff: StaffListDto;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

export const StaffListItem = ({staff, isSelected, onSelect}: StaffListItemProps) => {
    return (
        <li
            onClick={() => onSelect(staff.id)}
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${isSelected ? "active" : ""}`}
            style={{cursor: "pointer"}}
        >
            <div>
                <span className="fw-bold">{staff.firstName} {staff.lastName}</span>
            </div>

            <small
                className={`fw-bold ${staff.isActive === "Y" ? (isSelected ? "text-white" : "text-success") : (isSelected ? "text-white" : "text-danger")}`}>
                {staff.isActive === "Y" ? "Active" : "Inactive"}
            </small>
        </li>
    );
};


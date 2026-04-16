package pl.polsl.clinic.dto;

import pl.polsl.clinic.entity.Staff;
import pl.polsl.clinic.enums.UserType;

public record StaffListDto(
	Long id,
	String firstName,
	String lastName,
	UserType userType,
	String isActive    // To display e.g. red/green dot
) {
	public static StaffListDto fromEntity(Staff staff) {
		return new StaffListDto(
			staff.getUserId(),
			staff.getFirstName(),
			staff.getLastName(),
			staff.getUserType(),
			staff.getIsActive()
		);
	}
}

package pl.polsl.clinic.dto;

import pl.polsl.clinic.entity.Doctor;
import pl.polsl.clinic.entity.Staff;
import pl.polsl.clinic.enums.UserType;

public record StaffCreatedDto(
	Long id,
	String firstName,
	String lastName,
	String login,
	String temporaryPassword,
	UserType userType,
	String isActive,
	String passwdChangeRequired,
	String licenseNo
) {
	public static StaffCreatedDto fromEntity(Staff staff, String temporaryPassword) {
		if (staff == null) return null;

		String license = null;
		if (staff.getUserType() == UserType.Doctor) {
			Doctor d = (Doctor) staff;
			license = d.getLicenseNo();
		}

		return new StaffCreatedDto(
			staff.getUserId(),
			staff.getFirstName(),
			staff.getLastName(),
			staff.getLogin(),
			temporaryPassword,
			staff.getUserType(),
			staff.getIsActive(),
			staff.getPasswdChangeRequired(),
			license
		);
	}

}

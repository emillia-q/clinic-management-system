package pl.polsl.clinic.dto;

import pl.polsl.clinic.entity.Doctor;
import pl.polsl.clinic.entity.Staff;
import pl.polsl.clinic.enums.UserType;

public record StaffDto(
	Long id,
	String firstName,
	String lastName,
	String login,
	UserType userType,
	String isActive,
	String passwdChangeRequired,
	String licenseNo
) {
	public static StaffDto fromEntity(Staff staff) {
		if (staff == null) return null;

		String license = null;
		if (staff.getUserType() == UserType.Doctor) {
			Doctor d = (Doctor) staff;
			license = d.getLicenseNo();
		}

		return new StaffDto(
			staff.getUserId(),
			staff.getFirstName(),
			staff.getLastName(),
			staff.getLogin(),
			staff.getUserType(),
			staff.getIsActive(),
			staff.getPasswdChangeRequired(),
			license
		);
	}

}

package pl.polsl.clinic.dto;

import pl.polsl.clinic.entity.Doctor;

public record DoctorDto(
	Long userID,
	String firstName,
	String lastName,
	String login,
	Boolean isActive,
	String userType,
	String licenseNo
) {
	public static DoctorDto fromEntity(Doctor doctor) {
		return new DoctorDto(
			doctor.getUserID(),
			doctor.getFirstName(),
			doctor.getLastName(),
			doctor.getLogin(),
			doctor.getIsActive(),
			doctor.getUserType(),
			doctor.getLicenseNo()
		);
	}
}

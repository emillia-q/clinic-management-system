package pl.polsl.clinic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.polsl.clinic.entity.Doctor;

/// Hateoas requires not sealed/final classes.
@Data
@AllArgsConstructor
public class DoctorDto {
	private Long id;
	private String firstName;
	private String lastName;
	private String isActive = "Y";
	private String login;
	private String passwdChangeRequired = "Y";
	private String licenseNo;

	public static DoctorDto mapFromEntity(Doctor doctor) {
		return new DoctorDto(
			doctor.getUserId(),
			doctor.getFirstName(),
			doctor.getLastName(),
			doctor.getIsActive(),
			doctor.getLogin(),
			doctor.getPasswdChangeRequired(),
			doctor.getLicenseNo()
		);
	}
}

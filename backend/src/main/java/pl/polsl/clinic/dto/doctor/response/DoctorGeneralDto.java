package pl.polsl.clinic.dto.doctor.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.polsl.clinic.entity.Doctor;

/// Hateoas requires not sealed/final classes.
@Data
@AllArgsConstructor
public class DoctorGeneralDto {
	private Long id;
	private String firstName;
	private String lastName;
	private String isActive = "Y";

	public static DoctorGeneralDto mapFromEntity(Doctor doctor) {
		return new DoctorGeneralDto(
			doctor.getUserId(),
			doctor.getFirstName(),
			doctor.getLastName(),
			doctor.getIsActive()
		);
	}
}

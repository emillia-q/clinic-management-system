package pl.polsl.clinic.dto.patient.response;

import lombok.Data;
import pl.polsl.clinic.entity.Patient;

import java.time.LocalDate;

/// Hateoas requires not sealed/final classes.
@Data
public class PatientGeneralDto {
	private final Long id;
	private final String firstName;
	private final String lastName;
	private final String socialSecurityNo;
	private final LocalDate dateOfBirth;

	public static PatientGeneralDto fromEntity(Patient patient) {
		if (patient == null) return null;
		return new PatientGeneralDto(
			patient.getPatientId(),
			patient.getFirstName(),
			patient.getLastName(),
			patient.getSocialSecurityNo(),
			patient.getDateOfBirth()
		);
	}
}

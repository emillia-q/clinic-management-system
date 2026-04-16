package pl.polsl.clinic.dto;

import lombok.Data;
import pl.polsl.clinic.entity.Patient;

/// Hateoas requires not sealed/final classes.
@Data
public class PatientGeneralDto {
	private final Long id;
	private final String firstName;
	private final String lastName;
	private final String socialSecurityNo;

	public PatientGeneralDto(
		Long id,
		String firstName,
		String lastName,
		String socialSecurityNo
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.socialSecurityNo = socialSecurityNo;
	}

	public static PatientGeneralDto fromEntity(Patient patient) {
		if (patient == null) return null;
		return new PatientGeneralDto(
			patient.getPatientId(),
			patient.getFirstName(),
			patient.getLastName(),
			patient.getSocialSecurityNo()
		);
	}
}

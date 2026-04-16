package pl.polsl.clinic.dto;

import lombok.Data;
import pl.polsl.clinic.entity.Patient;

import java.time.LocalDate;

/// Hateoas requires not sealed/final classes.
@Data
public class PatientDto {
	private final Long id;
	private final String firstName;
	private final String lastName;
	private final String socialSecurityNo;
	private final LocalDate dateOfBirth;
	private final String email;
	private final String phoneNumber;
	private final AddressDto address;

	public PatientDto(
		Long id,
		String firstName,
		String lastName,
		String socialSecurityNo,
		LocalDate dateOfBirth,
		String email,
		String phoneNumber,
		AddressDto address
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.socialSecurityNo = socialSecurityNo;
		this.dateOfBirth = dateOfBirth;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.address = address;
	}

	public static PatientDto fromEntity(Patient patient) {
		if (patient == null) return null;
		return new PatientDto(
			patient.getPatientId(),
			patient.getFirstName(),
			patient.getLastName(),
			patient.getSocialSecurityNo(),
			patient.getDateOfBirth(),
			patient.getEmail(),
			patient.getPhoneNumber(),
			AddressDto.fromEntity(patient.getAddress())
		);
	}
}

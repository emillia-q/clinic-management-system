package pl.polsl.clinic.dto;

import pl.polsl.clinic.entity.Patient;

import java.time.LocalDate;

public record PatientDto(
	Long id,
	String firstName,
	String lastName,
	String socialSecurityNo,
	LocalDate dateOfBirth,
	String email,
	String phoneNumber,
	AddressDto address
) {
	public static PatientDto fromEntity(Patient patient) {
		if (patient == null) return null;
		return new PatientDto(
			patient.getPatientID(),
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

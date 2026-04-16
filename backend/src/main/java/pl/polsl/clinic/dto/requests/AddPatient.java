package pl.polsl.clinic.dto.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import pl.polsl.clinic.entity.Patient;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddPatient {
	@NotNull
	@Size(min = 1, max = 100)
	private String firstName;

	@NotNull
	@Size(min = 1, max = 100)
	private String lastName;

	@NotNull
	@Size(min = 11, max = 11)
	private String socialSecurityNo;

	@NotNull
	private LocalDate dateOfBirth;

	//not required
	@Email
	@Size(max = 100)
	private String email;

	@NotNull
	@Pattern(regexp = "^(\\+48)?\\d{9}$")
	private String phoneNumber;

	@NotNull
	@Valid
	private AddAddress address;

	public Patient mapToEntity() {
		Patient patient = new Patient();
		populatePatientFields(patient);
		return patient;
	}

	public void populatePatientFields(Patient patient) {
		patient.setFirstName(firstName);
		patient.setLastName(lastName);
		patient.setSocialSecurityNo(socialSecurityNo);
		patient.setDateOfBirth(dateOfBirth);
		if (email == null || StringUtils.isBlank(email))
			patient.setEmail(null);
		else
			patient.setEmail(email);
		patient.setPhoneNumber(phoneNumber);

		var patientsAddress = patient.getAddress();
		if (patientsAddress != null) {
			address.populateAddressFields(patientsAddress);
		}
	}
}


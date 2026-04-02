package pl.polsl.clinic.dto.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
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
	@Pattern(regexp = "^\\(?\\+[0-9]{1,3}\\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\\w{1,10}\\s?\\d{1,6})?$")
	private String phoneNumber;

	@NotNull
	@Valid
	private AddAddress address;
}


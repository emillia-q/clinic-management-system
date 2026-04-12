package pl.polsl.clinic.dto.requests;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import pl.polsl.clinic.enums.UserType;

@Data
public class AddStaff {
	@NotNull
	@Size(min = 1, max = 100)
	private String firstName;

	@NotNull
	@Size(min = 1, max = 100)
	private String lastName;

	@NotNull
	private UserType userType;

	@Size(max = 7)
	private String licenseNo;
}

package pl.polsl.clinic.dto.staff.request;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import pl.polsl.clinic.enums.UserType;
import pl.polsl.clinic.validator.ValidStaffRequest;

@Data
@ValidStaffRequest
public class AddStaff {
	@NotNull
	@Size(min = 1, max = 100)
	private String firstName;

	@NotNull
	@Size(min = 1, max = 100)
	private String lastName;

	@NotNull
	private UserType userType;

	private String licenseNo;
}

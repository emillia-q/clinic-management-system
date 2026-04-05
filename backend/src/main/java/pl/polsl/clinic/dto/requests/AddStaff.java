package pl.polsl.clinic.dto.requests;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public abstract class AddStaff {
	@NotNull
	@Size(min = 1, max = 100)
	private String firstName;

	@NotNull
	@Size(min = 1, max = 100)
	private String lastName;

	@NotNull
	@Size(min = 3, max = 100)
	private String login;

	@NotNull
	@Size(min = 6, max = 100)
	private String password;

	@NotNull
	private Boolean isActive;
}

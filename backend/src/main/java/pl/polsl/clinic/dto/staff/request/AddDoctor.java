package pl.polsl.clinic.dto.staff.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class AddDoctor extends AddStaff {
	@NotNull
	@Size(min = 7, max = 7, message = "License number must be exactly 7 characters.")
	private String licenseNo;
}

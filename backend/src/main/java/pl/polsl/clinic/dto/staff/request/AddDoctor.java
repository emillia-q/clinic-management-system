package pl.polsl.clinic.dto.staff.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class AddDoctor extends AddStaff {
	@NotNull
	@Size(min = 1, max = 7)
	private String licenseNo;
}

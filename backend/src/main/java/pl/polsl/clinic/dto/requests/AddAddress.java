package pl.polsl.clinic.dto.requests;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddAddress {
	@NotNull
	@Size(min = 1, max = 100)
	private final String city;

	@NotNull
	@Size(min = 1, max = 100)
	private final String street;

	@NotNull
	private final Integer houseNo;

	@Null
	private final Integer apartmentNo;
}

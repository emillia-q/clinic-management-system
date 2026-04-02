package pl.polsl.clinic.dto.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import pl.polsl.clinic.entity.Doctor;

@EqualsAndHashCode(callSuper = true)
@Data
@Valid
public class UpdateDoctor extends AddDoctor {
	@NotNull
	private Long id;
	@NotNull
	private boolean isActive;

	public void updateEntity(Doctor doctor) {
		populateFields(doctor);
		doctor.setIsActive(isActive);
	}
}

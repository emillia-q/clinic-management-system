package pl.polsl.clinic.dto.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import pl.polsl.clinic.entity.Patient;

@EqualsAndHashCode(callSuper = true)
@Data
public class UpdatePatient extends AddPatient {
	@NotNull
	private Long id;

	public void populatePatientFields(Patient patient) {
		super.populatePatientFields(patient);
	}
}

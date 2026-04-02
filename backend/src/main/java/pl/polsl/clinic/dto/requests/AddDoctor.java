package pl.polsl.clinic.dto.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import pl.polsl.clinic.entity.Doctor;

@EqualsAndHashCode(callSuper = true)
@Data
@Valid
public class AddDoctor extends AddStaff {
	@NotNull
	@Size(min = 1, max = 7)
	private String licenseNo;

	@Override
	public Doctor mapToEntity() {
		var doctor = new Doctor();
		populateFields(doctor);
		return doctor;
	}

	protected void populateFields(Doctor doctor) {
		populateStaffFields(doctor);
		doctor.setLicenseNo(getLicenseNo());
	}
}

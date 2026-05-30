package pl.polsl.clinic.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import pl.polsl.clinic.dto.staff.request.AddStaff;
import pl.polsl.clinic.enums.UserType;

public class StaffRequestValidator implements ConstraintValidator<ValidStaffRequest, AddStaff> {

	@Override
	public boolean isValid(AddStaff dto, ConstraintValidatorContext context) {
		if (dto.getUserType() != UserType.Doctor) {
			return true;
		}

		String license = dto.getLicenseNo() == null ? "" : dto.getLicenseNo().trim();
		if (license.isEmpty()) {
			addFieldError(context, "licenseNo", "License number is required for doctors.");
			return false;
		}
		if (license.length() != 7) {
			addFieldError(context, "licenseNo", "License number must be exactly 7 characters.");
			return false;
		}
		return true;
	}

	private void addFieldError(ConstraintValidatorContext context, String field, String message) {
		context.disableDefaultConstraintViolation();
		context.buildConstraintViolationWithTemplate(message)
			.addPropertyNode(field)
			.addConstraintViolation();
	}
}

package pl.polsl.clinic.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PeselValidator implements ConstraintValidator<PESEL, String> {

	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		// Let @NotNull or @NotEmpty handle null/empty checks
		if (value == null || value.isEmpty()) {
			return true;
		}
		// 1. Length check
		if (value.length() != 11) {
			setCustomMessage(context, "PESEL must be exactly 11 digits long");
			return false;
		}
		// 2. Digits only check
		if (!value.matches("\\d+")) {
			setCustomMessage(context, "PESEL must contain only digits");
			return false;
		}
		// 3. Checksum validation
		if (!isValidChecksum(value)) {
			setCustomMessage(context, "PESEL checksum is invalid (mathematically incorrect)");
			return false;
		}
		// Valid
		return true;
	}

	private boolean isValidChecksum(String pesel) {
		final int[] weights = {1, 3, 7, 9, 1, 3, 7, 9, 1, 3};
		int sum = 0;

		for (int i = 0; i < 10; i++) {
			sum += Character.getNumericValue(pesel.charAt(i)) * weights[i];
		}

		int controlDigit = Character.getNumericValue(pesel.charAt(10));
		int calculatedControl = (10 - (sum % 10)) % 10;

		return controlDigit == calculatedControl;
	}

	private void setCustomMessage(ConstraintValidatorContext context, String message) {
		context.disableDefaultConstraintViolation(); // Stop the default message from @PESEL
		context.buildConstraintViolationWithTemplate(message)
			.addConstraintViolation();
	}
}

package pl.polsl.clinic.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class FieldValidationException extends RuntimeException {
	private final Map<String, String> fieldErrors;

	public FieldValidationException(String field, String message) {
		super(message);
		this.fieldErrors = Map.of(field, message);
	}
}

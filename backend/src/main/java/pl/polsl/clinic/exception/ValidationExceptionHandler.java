package pl.polsl.clinic.exception;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import pl.polsl.clinic.dto.ValidationErrorDetails;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class ValidationExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ApiResponse(responseCode = "400", description = "Validation failed", content = {@Content(schema = @Schema(implementation = ValidationErrorDetails.class))})
	public ResponseEntity<@NonNull ValidationErrorDetails> handleValidationException(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(error -> {
			errors.put(error.getField(), error.getDefaultMessage());
		});
		ValidationErrorDetails details = new ValidationErrorDetails(
				OffsetDateTime.now(ZoneOffset.UTC), // Requirement: UTC Format
				"Validation failed for one or more fields.",
				errors
		);
		return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ResponseEntity<ValidationErrorDetails> handleConstraintViolationException(ConstraintViolationException ex) {
		Map<String, String> errors = new HashMap<>();

		ex.getConstraintViolations().forEach(violation -> {
			String propertyPath = violation.getPropertyPath().toString();
			String fieldName = propertyPath.substring(propertyPath.lastIndexOf('.') + 1);
			errors.put(fieldName, violation.getMessage());
		});

		ValidationErrorDetails details = new ValidationErrorDetails(
			OffsetDateTime.now(ZoneOffset.UTC),
			"Validation failed for one or more parameters.",
			errors
		);

		return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
	}
}

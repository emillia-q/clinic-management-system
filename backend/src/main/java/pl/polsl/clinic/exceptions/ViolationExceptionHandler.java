package pl.polsl.clinic.exceptions;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class ViolationExceptionHandler {

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<@NonNull Map<String, String>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
		log.error("Data integrity violation: {}", ex.getMessage());
		Map<String, String> error = new HashMap<>();
		error.put("error", "Database constraint violation. Possible duplicate entry or foreign key constraint.");
		return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}

}

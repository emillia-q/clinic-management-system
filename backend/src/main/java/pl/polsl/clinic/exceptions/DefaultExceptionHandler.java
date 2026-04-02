package pl.polsl.clinic.exceptions;

import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import pl.polsl.clinic.dto.ItemNotFoundErrorDetails;

@RestControllerAdvice
@Slf4j
public class DefaultExceptionHandler {

	@ExceptionHandler(ItemNotFoundException.class)
	public ResponseEntity<@NotNull ItemNotFoundErrorDetails> handleItemNotFound(ItemNotFoundException ex) {
		return new ResponseEntity<@NotNull ItemNotFoundErrorDetails>(new ItemNotFoundErrorDetails(ex.getMessage()), HttpStatus.NOT_FOUND);
	}

}

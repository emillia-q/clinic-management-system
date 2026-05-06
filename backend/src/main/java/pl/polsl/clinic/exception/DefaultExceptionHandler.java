package pl.polsl.clinic.exception;

import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import pl.polsl.clinic.dto.common.error.InvalidParametersErrorDetails;
import pl.polsl.clinic.dto.common.error.ItemNotFoundErrorDetails;

@RestControllerAdvice
@Slf4j
public class DefaultExceptionHandler {

	@ExceptionHandler(ItemNotFoundException.class)
//	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ResponseEntity<@NotNull ItemNotFoundErrorDetails> handleItemNotFound(ItemNotFoundException ex) {
		return new ResponseEntity<@NotNull ItemNotFoundErrorDetails>(new ItemNotFoundErrorDetails(ex.getMessage()), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(InvalidParametersException.class)
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ResponseEntity<@NotNull InvalidParametersErrorDetails> handleInvalidParameters(InvalidParametersException ex) {
		return new ResponseEntity<@NotNull InvalidParametersErrorDetails>(new InvalidParametersErrorDetails(ex.getMessage()), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(NoContentFoundException.class)
//	@ResponseStatus(HttpStatus.NO_CONTENT)
	public ResponseEntity<@NotNull InvalidParametersErrorDetails> handleInvalidParameters(NoContentFoundException ex) {
		return new ResponseEntity<@NotNull InvalidParametersErrorDetails>(new InvalidParametersErrorDetails(ex.getMessage()), HttpStatus.NO_CONTENT);
	}

}

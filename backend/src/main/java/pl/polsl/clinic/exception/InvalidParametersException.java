package pl.polsl.clinic.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(HttpStatus.NOT_FOUND)
public class InvalidParametersException extends RuntimeException {
	public InvalidParametersException(String msg) {
		super(msg);
	}
}

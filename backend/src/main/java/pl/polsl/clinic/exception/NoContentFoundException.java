package pl.polsl.clinic.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(HttpStatus.NO_CONTENT)
public class NoContentFoundException extends RuntimeException {
	private final Object id;

	public NoContentFoundException(Class<?> entityClass, Object id) {
		super(String.format("%s has no content: %s", entityClass.getSimpleName(), id));
		this.id = id;
	}
}

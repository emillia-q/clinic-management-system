package pl.polsl.clinic.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ItemNotFoundException extends RuntimeException {
	private final Object id;

	public ItemNotFoundException(Class<?> entityClass, Object id) {
		this.id = id;
		super(String.format("%s not found with ID: %s", entityClass.getSimpleName(), id));
	}
}

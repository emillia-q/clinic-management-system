package pl.polsl.clinic.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PeselValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface PESEL {
	String message() default "Invalid PESEL number";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}

package pl.polsl.clinic.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = StaffRequestValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidStaffRequest {
	String message() default "Invalid staff request";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}

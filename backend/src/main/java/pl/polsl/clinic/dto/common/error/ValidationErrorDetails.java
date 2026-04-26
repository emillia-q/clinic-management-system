package pl.polsl.clinic.dto.common.error;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
public class ValidationErrorDetails {
	private OffsetDateTime timestamp; // UTC Format
	private String message;
	private Map<String, String> errors;
}

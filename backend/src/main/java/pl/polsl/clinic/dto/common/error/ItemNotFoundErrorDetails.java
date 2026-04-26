package pl.polsl.clinic.dto.common.error;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NotNull
public class ItemNotFoundErrorDetails {
	private final OffsetDateTime timestamp = OffsetDateTime.now(); // UTC Format
	private String message;
}

package pl.polsl.clinic.dto.requests;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record UpdateVisitRequest(
	@NotNull LocalDateTime appointmentDate,
	@NotNull String description,
	@NotNull Long doctorId
) {}
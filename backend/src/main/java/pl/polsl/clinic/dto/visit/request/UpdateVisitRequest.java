package pl.polsl.clinic.dto.visit.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import pl.polsl.clinic.enums.VisitStatus;

public record UpdateVisitRequest(
	@NotNull LocalDateTime appointmentDate,
	@NotNull String description,
	@NotNull Long doctorId,
	@NotNull VisitStatus status
) {}

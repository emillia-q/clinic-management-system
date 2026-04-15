package pl.polsl.clinic.dto.requests;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record CreateVisitRequest(
	@NotNull Long patientId,
	@NotNull Long doctorId,
	@NotNull Long receptionistId,
	@NotNull LocalDateTime appointmentDate,
	@NotNull String description
) {}
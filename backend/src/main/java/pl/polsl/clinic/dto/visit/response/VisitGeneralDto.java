package pl.polsl.clinic.dto.visit.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.polsl.clinic.entity.Visit;

import java.time.LocalDateTime;

/// This is a very light weight DTO that only fetches info from one table, optimized for large set performance.
@Data
@AllArgsConstructor
public class VisitGeneralDto {
	private Long visitId;
	private Long patientId;
	private Long doctorId;
	private String status;
	private LocalDateTime appointmentDate;

	public static VisitGeneralDto fromEntity(Visit visit) {
		return new VisitGeneralDto(
			visit.getVisitId(),
			visit.getPatient().getPatientId(),
			visit.getDoctor().getUserId(),
			visit.getStatus().toString(),
			visit.getAppointmentDate()
		);
	}
}

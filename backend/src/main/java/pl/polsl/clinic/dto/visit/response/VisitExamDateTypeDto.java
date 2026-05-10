package pl.polsl.clinic.dto.visit.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.polsl.clinic.entity.LabExam;
import pl.polsl.clinic.entity.PhysicalExam;
import pl.polsl.clinic.entity.Visit;

import java.time.LocalDateTime;

/// This is a very light weight DTO that only fetches info from one table, optimized for large set performance.
@Data
@AllArgsConstructor
public class VisitExamDateTypeDto {
	private Long id;
	private LocalDateTime date;
	private String type;

	public static VisitExamDateTypeDto fromEntity(Visit ent) {
		return new VisitExamDateTypeDto(
			ent.getVisitId(),
			ent.getAppointmentDate(),
			ent.getDescription() == null || ent.getDescription().isBlank() ? "No description" : ent.getDescription()
		);
	}

	public static VisitExamDateTypeDto fromEntity(LabExam ent) {
		return new VisitExamDateTypeDto(
			ent.getLabExamId(),
			ent.getOrderDate(),
			ent.getExamDict().getExamCode()
		);
	}

	public static VisitExamDateTypeDto fromEntity(PhysicalExam ent) {
		return new VisitExamDateTypeDto(
			ent.getPhysicalExamId(),
			ent.getVisit().getAppointmentDate(),
			ent.getExamDict().getExamCode()
		);
	}
}

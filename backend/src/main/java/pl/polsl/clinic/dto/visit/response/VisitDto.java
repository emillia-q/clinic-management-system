package pl.polsl.clinic.dto.visit.response;

import pl.polsl.clinic.entity.Visit;
import java.time.LocalDateTime;

public record VisitDto(
	Long id,
	String patientName,
	String socialSecurityNo,
	String doctorName,
	String status,
	LocalDateTime appointmentDate,
	String description,
	String diagnosis
) {
	public static VisitDto fromEntity(Visit visit) {
		return new VisitDto(
			visit.getVisitId(),
			visit.getPatient().getFirstName() + " " + visit.getPatient().getLastName(),
			visit.getPatient().getSocialSecurityNo(),
			visit.getDoctor().getFirstName() + " " + visit.getDoctor().getLastName(),
			visit.getStatus().toString(),
			visit.getAppointmentDate(),
			visit.getDescription(),
			visit.getDiagnosis()
		);
	}
}

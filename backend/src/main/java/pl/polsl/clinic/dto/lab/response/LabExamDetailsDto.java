package pl.polsl.clinic.dto.lab.response;

import pl.polsl.clinic.entity.LabExam;

import java.time.LocalDateTime;

public record LabExamDetailsDto(
	Long id,
	String examName,
	String patientName,
	String patientPesel,
	String orderedByDoctor,
	LocalDateTime orderDate,
	LocalDateTime completionDate,
	String status,
	String result,
	String doctorNotes,
	String managerNotes
) {
	public static LabExamDetailsDto fromEntity(LabExam entity) {
		return new LabExamDetailsDto(
			entity.getLabExamId(),
			entity.getExamDict().getExamName(),
			entity.getVisit().getPatient().getFirstName() + " " + entity.getVisit().getPatient().getLastName(),
			entity.getVisit().getPatient().getSocialSecurityNo(),
			entity.getVisit().getDoctor().getFirstName() + " " + entity.getVisit().getDoctor().getLastName(),
			entity.getOrderDate(),
			entity.getExecutionCancelDate(), // Cancellation or execution date
			entity.getStatus(),
			entity.getResult(),
			entity.getDoctorNotes(),
			entity.getManagerNotes()
		);
	}
}

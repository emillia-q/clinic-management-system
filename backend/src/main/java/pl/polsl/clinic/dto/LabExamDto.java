package pl.polsl.clinic.dto;

import pl.polsl.clinic.entity.LabExam;

public record LabExamDto(
	Long id,
	String examName,
	String patientName,
	String status,
	String result,
	String doctorNotes
) {
	public static LabExamDto fromEntity(LabExam entity) {
		return new LabExamDto(
			entity.getLabExamId(),
			entity.getExamDict().getExamName(),
			entity.getVisit().getPatient().getFirstName() + " " + entity.getVisit().getPatient().getLastName(),
			entity.getStatus(),
			entity.getResult(),
			entity.getDoctorNotes()
		);
	}
}
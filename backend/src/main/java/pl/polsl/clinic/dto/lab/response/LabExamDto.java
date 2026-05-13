package pl.polsl.clinic.dto.lab.response;

import pl.polsl.clinic.entity.LabExam;

public record LabExamDto(
	Long id,
	String examCode,
	String examName,
	String status,
	String doctorNotes
) {
	public static LabExamDto fromEntity(LabExam entity) {
		return new LabExamDto(
			entity.getLabExamId(),
			entity.getExamDict().getExamCode(),
			entity.getExamDict().getExamName(),
			entity.getStatus(),
			entity.getDoctorNotes()
		);
	}
}

package pl.polsl.clinic.dto.lab.response;

import pl.polsl.clinic.entity.LabExam;
import pl.polsl.clinic.entity.LabManager;
import pl.polsl.clinic.entity.LabTechnician;

import java.time.LocalDateTime;
import java.util.Optional;

public record LabExamDetailsDto(
	Long id,
	String examCode,
	String examName,
	String patientName,
	String patientPesel,
	String orderedByDoctor,
	LocalDateTime orderDate,
	LocalDateTime completionDate,
	LocalDateTime approvalRejectionDate,
	String status,
	String result,
	String doctorNotes,
	String managerNotes,
	String labTechnicianName,
	String labManagerName,
	Long doctorId,
	Long patientId
) {
	public static LabExamDetailsDto fromEntity(LabExam entity) {
		var patient = entity.getVisit().getPatient();   //not nullable
		var doctor = entity.getVisit().getDoctor();     //not nullable
		return new LabExamDetailsDto(
			entity.getLabExamId(),
			entity.getExamDict().getExamCode(),
			entity.getExamDict().getExamName(),
			patient.getFirstName() + " " + patient.getLastName(),
			patient.getSocialSecurityNo(),
			doctor.getFirstName() + " " + doctor.getLastName(),
			entity.getOrderDate(),
			entity.getExecutionCancelDate(),
			entity.getApprovalRejectionDate(),
			entity.getStatus(),
			entity.getResult(),
			entity.getDoctorNotes(),
			entity.getManagerNotes(),
			Optional.ofNullable(entity.getLabTechnician())
				.map(t -> t.getFirstName() + " " + t.getLastName())
				.orElse(null),
			Optional.ofNullable(entity.getLabManager())
				.map(m -> m.getFirstName() + " " + m.getLastName())
				.orElse(null),
			doctor.getUserId(),
			patient.getPatientId()
		);
	}
}

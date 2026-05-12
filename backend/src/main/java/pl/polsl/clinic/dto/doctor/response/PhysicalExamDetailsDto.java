package pl.polsl.clinic.dto.doctor.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.polsl.clinic.entity.PhysicalExam;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PhysicalExamDetailsDto {
	private Long id;
	private Long visitId;
	private Long patientId;
	private Long doctorId;

	private String examCode;
	private String examName;
	private String result;
	private LocalDateTime date;
	private String patientName;
	private String patientPesel;

	static public PhysicalExamDetailsDto fromEntity(PhysicalExam pe) {
		var visit = pe.getVisit();
		var patient = visit.getPatient();
		var doctor = visit.getDoctor();
		return new PhysicalExamDetailsDto(
			pe.getPhysicalExamId(),
			visit.getVisitId(),
			patient.getPatientId(),
			doctor.getUserId(),
			pe.getExamDict().getExamCode(),
			pe.getExamDict().getExamName(),
			pe.getResult(),
			visit.getAppointmentDate(),
			patient.getFirstName() + " " + patient.getLastName(),
			patient.getSocialSecurityNo()
		);
	}
}

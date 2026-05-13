package pl.polsl.clinic.dto.visit.response;

import pl.polsl.clinic.dto.doctor.response.PhysicalExamDto;
import pl.polsl.clinic.dto.lab.response.LabExamDto;
import pl.polsl.clinic.entity.Visit;

import java.time.LocalDateTime;
import java.util.List;

public record VisitDetailsWithOrdersDto(
	Long id,
	String patientName,
	String socialSecurityNo,
	String doctorName,
	String status,
	LocalDateTime appointmentDate,
	String description,
	String diagnosis,
	List<PhysicalExamDto> physicalExams,
	List<LabExamDto> labExams
) {
	public static VisitDetailsWithOrdersDto fromEntity(Visit visit) {
		return new VisitDetailsWithOrdersDto(
			visit.getVisitId(),
			visit.getPatient().getFirstName() + " " + visit.getPatient().getLastName(),
			visit.getPatient().getSocialSecurityNo(),
			visit.getDoctor().getFirstName() + " " + visit.getDoctor().getLastName(),
			visit.getStatus().toString(),
			visit.getAppointmentDate(),
			visit.getDescription(),
			visit.getDiagnosis(),
			visit.getPhysicalExams().stream().map(PhysicalExamDto::fromEntity).toList(),
			visit.getLabExams().stream().map(LabExamDto::fromEntity).toList()
		);
	}
}

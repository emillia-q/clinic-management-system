package pl.polsl.clinic.dto.visit.response;

import pl.polsl.clinic.dto.doctor.response.PhysicalExamDetailsDto;
import pl.polsl.clinic.dto.lab.response.LabExamDetailsDto;
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
	List<PhysicalExamDetailsDto> physicalExams,
	List<LabExamDetailsDto> labExams
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
			visit.getPhysicalExams().stream().map(PhysicalExamDetailsDto::fromEntity).toList(),
			visit.getLabExams().stream().map(LabExamDetailsDto::fromEntity).toList()
		);
	}
}

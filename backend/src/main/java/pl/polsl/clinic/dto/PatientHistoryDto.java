package pl.polsl.clinic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.polsl.clinic.dto.visit.response.VisitExamDateTypeDto;

import java.util.List;

@Data
@AllArgsConstructor
public class PatientHistoryDto {
	private List<VisitExamDateTypeDto> visits;
	private List<VisitExamDateTypeDto> physicalExams;
	private List<VisitExamDateTypeDto> labExams;
}
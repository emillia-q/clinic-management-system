package pl.polsl.clinic.dto.doctor.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.polsl.clinic.entity.PhysicalExam;

@Data
@AllArgsConstructor
public class PhysicalExamDto {
	private Long id;
	private String examCode;
	private String examName;
	private String result;

	static public PhysicalExamDto fromEntity(PhysicalExam pe) {
		return new PhysicalExamDto(
			pe.getPhysicalExamId(),
			pe.getExamDict().getExamCode(),
			pe.getExamDict().getExamName(),
			pe.getResult()
		);
	}
}

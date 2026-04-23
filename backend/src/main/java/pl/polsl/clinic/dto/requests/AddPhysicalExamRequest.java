package pl.polsl.clinic.dto.requests;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NonNull;

@Data
public class AddPhysicalExamRequest {
	@NonNull
	@NotEmpty
	private String examCode;
	@NonNull
	@NotEmpty
	private String result;
	//fill in from context
	@NonNull
	private Long visitId;
}

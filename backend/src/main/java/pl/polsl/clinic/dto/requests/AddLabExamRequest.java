package pl.polsl.clinic.dto.requests;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NonNull;

@Data
public class AddLabExamRequest {
	@NonNull
	@NotEmpty
	private String examCode;
	private String doctorNotes;
	//fill in from context
	@NonNull
	private Long visitId;
}

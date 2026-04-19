package pl.polsl.clinic.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum VisitStatus {
	Registered("Registered"),
	In_Progress("In Progress"),
	Finished("Finished"),
	Cancelled("Cancelled");

	private final String value;

	@JsonValue 
	@Override
	public String toString() {
		return value;
	}
}
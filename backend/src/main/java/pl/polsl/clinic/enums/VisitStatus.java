package pl.polsl.clinic.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
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

	@JsonCreator
	public static VisitStatus fromValue(String value) {
		if (value == null) return null;
		for (VisitStatus status : VisitStatus.values()) {
			if (status.value.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
				return status;
			}
		}
		return null;
	}
}
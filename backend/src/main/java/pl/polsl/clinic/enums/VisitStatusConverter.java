package pl.polsl.clinic.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class VisitStatusConverter implements AttributeConverter<VisitStatus, String> {

	@Override
	public String convertToDatabaseColumn(VisitStatus status) {
		return status == null ? null : status.getValue();
	}

	@Override
	public VisitStatus convertToEntityAttribute(String dbData) {
		return VisitStatus.fromValue(dbData);
	}
}

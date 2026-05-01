package pl.polsl.clinic.enums;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToVisitStatusConverter implements Converter<String, VisitStatus> {

	@Override
	public VisitStatus convert(String source) {
		if (source == null || source.isBlank()) {
			return null;
		}

		for (VisitStatus status : VisitStatus.values()) {
			if (status.getValue().equalsIgnoreCase(source) ||
				status.name().equalsIgnoreCase(source)) {
				return status;
			}
		}
		return null;
	}
}
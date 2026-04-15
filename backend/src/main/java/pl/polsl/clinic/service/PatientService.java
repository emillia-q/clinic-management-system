package pl.polsl.clinic.service;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.requests.AddPatient;
import pl.polsl.clinic.dto.requests.UpdatePatient;
import pl.polsl.clinic.entity.Patient;
import pl.polsl.clinic.entity.QPatient;
import pl.polsl.clinic.exception.InvalidParametersException;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.repository.PatientRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientService {
	private final PatientRepository patientRepository;

	/// This method is hella cursed (it has to save to DB twice).
	/// To prevent partial data we wrap it as single transaction.
	@Transactional
	public Patient add(@NotNull @Valid AddPatient addPatient) {
		Patient patient = addPatient.mapToEntity();

		var address = addPatient.getAddress().mapToEntity();
		address.setPatient(patient);
		patient.setAddress(address);

		return patientRepository.save(patient);
	}

	public List<Patient> findAll() {
		return patientRepository.findAll();
	}

	public Iterable<Patient> findMatchingBy(String firstName, String lastName, String socialSecurityNo) {
		if ((StringUtils.isBlank(firstName) || StringUtils.isBlank(lastName)) && StringUtils.isBlank(socialSecurityNo))
			throw new InvalidParametersException("name and surname or PESEL must be provided");
		QPatient patient = QPatient.patient;

		// (firstName AND lastName)
		BooleanExpression namePart = (firstName != null && lastName != null)
			? patient.firstName.equalsIgnoreCase(firstName).and(patient.lastName.equalsIgnoreCase(lastName))
			: Expressions.asBoolean(true).isFalse(); // Force 'false' if names missing

		// (socialSecurityNo)
		BooleanExpression ssnPart = (socialSecurityNo != null && !socialSecurityNo.isBlank())
			? patient.socialSecurityNo.eq(socialSecurityNo)
			: Expressions.asBoolean(true).isFalse(); // Force 'false' if PESEL missing

		// 1 OR 2
		BooleanExpression finalFilter = namePart.or(ssnPart);
		var patients = patientRepository.findAll(finalFilter);

		if (!patients.iterator().hasNext()) {
			String identifier = (socialSecurityNo != null) ? socialSecurityNo : (firstName + " " + lastName);
			throw new ItemNotFoundException(Patient.class, identifier);
		}
		return patients;
	}

	public Optional<Patient> findById(Long id) {
		return patientRepository.findById(id);
	}

	public Patient update(@NotNull UpdatePatient updatePatient) {
		var gotPatient = patientRepository.findById(updatePatient.getId());
		gotPatient.orElseThrow(() -> new ItemNotFoundException(Patient.class, updatePatient.getId()));
		Patient patient = gotPatient.get();
		updatePatient.populatePatientFields(patient);
		return patientRepository.save(patient);
	}
}

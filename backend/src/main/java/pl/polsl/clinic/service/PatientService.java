package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.requests.AddPatient;
import pl.polsl.clinic.dto.requests.UpdatePatient;
import pl.polsl.clinic.entity.Patient;
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

	public List<Patient> findMatchingBy(String firstName, String lastName, String socialSecurityNo) {
		if ((StringUtils.isBlank(firstName) || StringUtils.isBlank(lastName)) && StringUtils.isBlank(socialSecurityNo))
			throw new InvalidParametersException("(name and surname) or PESEL must be provided");
		if (!StringUtils.isBlank(socialSecurityNo) && (!StringUtils.isBlank(firstName) || !StringUtils.isBlank(lastName)))
			throw new InvalidParametersException("(name and surname) or PESEL must be provided not both");

		Specification<Patient> nameSpec = (root, query, cb) -> {
			if (firstName == null || lastName == null)
				return cb.disjunction(); // Returns 'false' if names are missing
			return cb.and(
				cb.equal(cb.lower(root.get(Patient.firstName_)), firstName.toLowerCase()),
				cb.equal(cb.lower(root.get(Patient.lastName_)), lastName.toLowerCase())
			);
		};
		Specification<Patient> ssnSpec = (root, query, cb) -> {
			if (socialSecurityNo == null || socialSecurityNo.isBlank())
				return cb.disjunction(); // Returns 'false' if SSN is missing
			return cb.equal(root.get(Patient.socialSecurityNo_), socialSecurityNo);
		};
		Specification<Patient> filter = Specification.where(nameSpec).or(ssnSpec);
		var patients = patientRepository.findAll(filter);
		if (patients.isEmpty()) {
			String identifier = (socialSecurityNo != null) ? "PESEL: " + socialSecurityNo : "Name: " + (firstName + " " + lastName);
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

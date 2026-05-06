package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.patient.request.AddPatient;
import pl.polsl.clinic.dto.patient.request.UpdatePatient;
import pl.polsl.clinic.entity.Patient;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.exception.NoContentFoundException;
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

	public List<Patient> findMatchingBy(String firstName, String lastName, String socialSecurityNo) {
		Specification<Patient> fNameSpec = (root, query, cb) -> {
			if (firstName == null)
				return cb.conjunction(); // Returns 'true' if names are missing to not change results
			return cb.equal(cb.lower(root.get(Patient.firstName_)), firstName.toLowerCase());
		};
		Specification<Patient> lNameSpec = (root, query, cb) -> {
			if (lastName == null)
				return cb.conjunction(); // Returns 'true' if names are missing to not change results
			return cb.equal(cb.lower(root.get(Patient.lastName_)), lastName.toLowerCase());
		};
		Specification<Patient> ssnSpec = (root, query, cb) -> {
			if (socialSecurityNo == null || socialSecurityNo.isBlank())
				return cb.conjunction(); // Returns 'true' if SSN is missing to not change results
			return cb.equal(root.get(Patient.socialSecurityNo_), socialSecurityNo);
		};

		Specification<Patient> filter = Specification.where(fNameSpec).and(lNameSpec).and(ssnSpec);
		var patients = patientRepository.findAll(filter);

		if (patients.isEmpty()) {
			String identifier = "PESEL: " + socialSecurityNo + " Name: " + firstName + " Surname: " + lastName;
			throw new NoContentFoundException(Patient.class, identifier);
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

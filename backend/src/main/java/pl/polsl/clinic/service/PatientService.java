package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.requests.AddPatient;
import pl.polsl.clinic.dto.requests.UpdatePatient;
import pl.polsl.clinic.entity.Patient;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.repository.PatientRepository;

import java.util.ArrayList;
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
		List<@NotNull Patient> patients;
		if (socialSecurityNo != null && !socialSecurityNo.trim().isEmpty()) {
			patients = new ArrayList<>();
			patients.add(patientRepository.findBySocialSecurityNo(socialSecurityNo).orElseThrow(() -> new ItemNotFoundException(Patient.class, socialSecurityNo)));
		} else {
			patients = patientRepository.findByFirstNameAndLastName(firstName, lastName);
			if (patients.isEmpty()) throw new ItemNotFoundException(Patient.class, firstName + " " + lastName);
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

package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.requests.AddPatient;
import pl.polsl.clinic.dto.requests.UpdatePatient;
import pl.polsl.clinic.entity.Patient;
import pl.polsl.clinic.exceptions.ItemNotFoundException;
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
		patient = patientRepository.save(patient);
		patient.setAddress(addPatient.getAddress().mapToEntity());
		patient.getAddress().setPatientID(patient.getPatientID());
		patient.getAddress().setPatient(patient);
		return patientRepository.save(patient);
	}

	public List<Patient> findAll() {
		return patientRepository.findAll();
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

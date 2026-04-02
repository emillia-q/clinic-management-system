package pl.polsl.clinic.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.requests.AddPatient;
import pl.polsl.clinic.entity.Address;
import pl.polsl.clinic.entity.Patient;
import pl.polsl.clinic.exceptions.ItemNotFoundException;
import pl.polsl.clinic.repository.PatientRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientService {
	private final PatientRepository patientRepository;

	public Patient addPatient(@Valid AddPatient addPatient) {
		var patient = Patient.builder()
				.firstName(addPatient.getFirstName())
				.lastName(addPatient.getLastName())
				.socialSecurityNo(addPatient.getSocialSecurityNo())
				.dateOfBirth(addPatient.getDateOfBirth())
				.email(addPatient.getEmail())
				.phoneNumber(addPatient.getPhoneNumber())
				.build();
		patient = patientRepository.save(patient);
		var addAddress = addPatient.getAddress();
		var address = Address.builder()
				.patientID(patient.getPatientID())
				.city(addAddress.getCity())
				.street(addAddress.getStreet())
				.houseNo(addAddress.getHouseNo())
				.apartmentNo(addAddress.getApartmentNo())
				.build();
		patient.setAddress(address);
		address.setPatient(patient);
		patientRepository.save(patient);
		return patient;
	}

	public Iterable<Patient> findAll() {
		return patientRepository.findAll();
	}

	public Optional<Patient> findById(Long id) {
		return patientRepository.findById(id);
	}

	public void updateById(Long id, @NotNull AddPatient addPatient) {
		var gotPatient = patientRepository.findById(id);
		gotPatient.orElseThrow(() -> new ItemNotFoundException(Patient.class, id));
		var patient = gotPatient.get();

		patient.setFirstName(addPatient.getFirstName());
		patient.setLastName(addPatient.getLastName());
		patient.setSocialSecurityNo(addPatient.getSocialSecurityNo());
		patient.setDateOfBirth(addPatient.getDateOfBirth());
		patient.setEmail(addPatient.getEmail());
		patient.setPhoneNumber(addPatient.getPhoneNumber());

		var address = patient.getAddress();
		address.setCity(addPatient.getAddress().getCity());
		address.setStreet(addPatient.getAddress().getStreet());

		address.setHouseNo(addPatient.getAddress().getHouseNo());
		address.setApartmentNo(addPatient.getAddress().getApartmentNo());
		address.setPatientID(patient.getPatientID());

		patientRepository.save(gotPatient.get());
	}
}

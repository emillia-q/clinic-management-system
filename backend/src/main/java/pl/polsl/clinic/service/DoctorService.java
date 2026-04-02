package pl.polsl.clinic.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.requests.AddDoctor;
import pl.polsl.clinic.dto.requests.UpdateDoctor;
import pl.polsl.clinic.entity.Doctor;
import pl.polsl.clinic.exceptions.ItemNotFoundException;
import pl.polsl.clinic.repository.DoctorRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorService {
	private final DoctorRepository doctorRepository;

	public Optional<Doctor> findByLicenseNo(String licenseNo) {
		return doctorRepository.findByLicenseNo(licenseNo);
	}

	public Optional<Doctor> findById(Long id) {
		return doctorRepository.findById(id);
	}

	public Doctor add(AddDoctor addDoctor) {
		Doctor doctor = addDoctor.mapToEntity();
		return doctorRepository.save(doctor);
	}

	public List<Doctor> findAll() {
		return doctorRepository.findAll();
	}

	public Doctor update(@NotNull @Valid UpdateDoctor doctor) {
		var gotDoctor = doctorRepository.findById(doctor.getId());
		gotDoctor.orElseThrow(() -> new ItemNotFoundException(Doctor.class, doctor.getId()));
		doctor.updateEntity(gotDoctor.get());
		return doctorRepository.save(gotDoctor.get());
	}
}

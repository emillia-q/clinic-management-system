package pl.polsl.clinic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.entity.Doctor;
import pl.polsl.clinic.entity.Receptionist;
import pl.polsl.clinic.repository.*;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StaffService {
	private final DoctorRepository doctorRepository;
	private final ReceptionistRepository receptionistRepository;
	private final LabTechnicianRepository labTechnicianRepository;
	private final LabManagerRepository labManagerRepository;


	public Iterable<Doctor> findAllDoctors() {
		return doctorRepository.findAll();
	}

	public Iterable<Receptionist> findAllReceptionists() {
		return receptionistRepository.findAll();
	}

	public Optional<Doctor> findDoctorById(Long id) {
		return doctorRepository.findById(id);
	}

	public Optional<Receptionist> findReceptionistById(Long id) {
		return receptionistRepository.findById(id);
	}


}

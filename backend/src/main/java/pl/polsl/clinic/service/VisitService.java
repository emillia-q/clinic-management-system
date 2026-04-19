package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.requests.CreateVisitRequest;
import pl.polsl.clinic.entity.*;
import pl.polsl.clinic.enums.VisitStatus;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.repository.*;
import pl.polsl.clinic.dto.VisitDto;
import pl.polsl.clinic.dto.requests.UpdateVisitRequest;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitService {
	private final VisitRepository visitRepository;
	private final PatientRepository patientRepository;
	private final DoctorRepository doctorRepository;
	private final ReceptionistRepository receptionistRepository;

	@Transactional
	public VisitDto createVisit(CreateVisitRequest req) {
		Patient patient = patientRepository.findById(req.patientId())
			.orElseThrow(() -> new ItemNotFoundException(Patient.class, req.patientId()));

		Doctor doctor = doctorRepository.findById(req.doctorId())
			.orElseThrow(() -> new ItemNotFoundException(Doctor.class, req.doctorId()));

		Receptionist receptionist = receptionistRepository.findById(req.receptionistId())
			.orElseThrow(() -> new ItemNotFoundException(Receptionist.class, req.receptionistId()));

		Visit visit = new Visit();
		visit.setPatient(patient);
		visit.setDoctor(doctor);
		visit.setReceptionist(receptionist);
		visit.setAppointmentDate(req.appointmentDate());
		visit.setDescription(req.description());
		visit.setRegistrationDate(LocalDateTime.now());
		visit.setStatus(VisitStatus.Registered);

		Visit savedVisit = visitRepository.save(visit);
		return VisitDto.fromEntity(savedVisit);
	}

	public List<VisitDto> getAllVisits(VisitStatus status) {
		List<Visit> visits;
		if (status != null) {
			visits = visitRepository.findByStatus(status);
		} else {
			visits = visitRepository.findAll();
		}

		return visits.stream()
			.map(VisitDto::fromEntity)
			.toList();
	}

	@Transactional
	public VisitDto updateStatus(Long id, VisitStatus newStatus) {
		Visit visit = visitRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(Visit.class, id));

		visit.setStatus(newStatus);

		if (newStatus == VisitStatus.Cancelled || newStatus == VisitStatus.Finished) {
			visit.setCompletionCancelDate(LocalDateTime.now());
		}

		return VisitDto.fromEntity(visitRepository.save(visit));
	}

	@Transactional
	public VisitDto updateVisit(Long id, UpdateVisitRequest req) {
		Visit visit = visitRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(Visit.class, id));

		visit.setAppointmentDate(req.appointmentDate());
		visit.setDescription(req.description());

		if (!visit.getDoctor().getUserId().equals(req.doctorId())) {
			Doctor newDoctor = doctorRepository.findById(req.doctorId())
				.orElseThrow(() -> new ItemNotFoundException(Doctor.class, req.doctorId()));
			visit.setDoctor(newDoctor);
		}

		return VisitDto.fromEntity(visitRepository.save(visit));
	}

	public List<VisitDto> getPatientVisitHistory(Long patientId) {
		if (!patientRepository.existsById(patientId)) {
			throw new ItemNotFoundException(Patient.class, patientId);
		}

		return visitRepository.findByPatientPatientIdOrderByAppointmentDateDesc(patientId)
			.stream()
			.map(VisitDto::fromEntity)
			.toList();
	}
}
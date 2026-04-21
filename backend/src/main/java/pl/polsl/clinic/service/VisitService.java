package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.requests.CreateVisitRequest;
import pl.polsl.clinic.entity.*;
import pl.polsl.clinic.enums.VisitStatus;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.repository.*;
import pl.polsl.clinic.dto.VisitDto;
import pl.polsl.clinic.dto.requests.UpdateVisitRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitService {
	private final VisitRepository visitRepository;
	private final PatientRepository patientRepository;
	private final DoctorRepository doctorRepository;
	private final ReceptionistRepository receptionistRepository;


	/// max amount of fetched rows
	static private final Integer maxFetchLimit = 1_000;

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

	//TODO: remove this method, use getMatchingVisits() instead
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

	//TODO: remove this method, use getMatchingVisits() instead
	public List<VisitDto> getPatientVisitHistory(Long patientId) {
		if (!patientRepository.existsById(patientId)) {
			throw new ItemNotFoundException(Patient.class, patientId);
		}

		return visitRepository.findByPatientPatientIdOrderByAppointmentDateDesc(patientId)
			.stream()
			.map(VisitDto::fromEntity)
			.toList();
	}

	public record VisitParams(Long doctorId, Long patientId, LocalDate fromDate, LocalDate toDate,
	                          VisitStatus status, Integer limit, Sort.Direction sortOrder) {
		public VisitParams(Long doctorId, Long patientId, LocalDate fromDate, LocalDate toDate, VisitStatus status) {
			this(doctorId, patientId, fromDate, toDate, status, maxFetchLimit, Sort.Direction.ASC);
		}

		public VisitParams(Long doctorId, Long patientId, LocalDate fromDate, LocalDate toDate, VisitStatus status, Integer limit) {
			this(doctorId, patientId, fromDate, toDate, status, limit, Sort.Direction.ASC);
		}

		public VisitParams(Long doctorId, Long patientId, LocalDate date) {
			this(doctorId, patientId, date, date, null, maxFetchLimit, Sort.Direction.ASC);
		}

		public VisitParams(Long doctorId, Long patientId, Sort.Direction direction) {
			this(doctorId, patientId, null, null, null, maxFetchLimit, direction);
		}
	}

	/// @param params the limit field is used to fetch \[1, maxLimit\] of rows, any value outside that range will become maxLimit.
	public Iterable<Visit> getMatchingVisits(@NonNull VisitParams params) {
		Specification<Visit> doctorFilter = (root, query, cb) -> {
			if (params.doctorId == null)
				return cb.conjunction(); // Returns 'true' if no doctorId is provided
			return cb.equal(root.get(Visit.doctor_).get(Doctor.userId_), params.doctorId);
		};

		Specification<Visit> patientFilter = (root, query, cb) -> {
			if (params.patientId == null)
				return cb.conjunction(); // Returns 'true' if no patientId is provided
			return cb.equal(root.get(Visit.patient_).get(Patient.patientId_), params.patientId);
		};

		Specification<Visit> dateFilter = (root, query, cb) -> {
			if (params.fromDate == null && params.toDate == null)
				return cb.conjunction(); // Returns 'true' if no dates are provided
			if (params.fromDate == null) {
				//all up to ...
				LocalDateTime endOfDate = params.toDate.atTime(LocalTime.MAX);
				return cb.lessThanOrEqualTo(root.get(Visit.appointmentDate_), endOfDate);
			} else if (params.toDate == null) {
				//all before ...
				LocalDateTime startOfDate = params.fromDate.atStartOfDay();
				return cb.greaterThanOrEqualTo(root.get(Visit.appointmentDate_), startOfDate);
			}
			LocalDateTime startOfDate = params.fromDate.atStartOfDay();
			LocalDateTime endOfDate = params.toDate.atTime(LocalTime.MAX);
			//compare in between 00:00:00 and 23:59:59.999
			return cb.between(root.get(Visit.appointmentDate_), startOfDate, endOfDate);
		};

		Specification<Visit> statusFilter = (root, query, cb) -> {
			if (params.status == null)
				return cb.conjunction(); // Returns 'true' if no status is provided
			return cb.equal(root.get(Visit.status_), params.status);
		};

		Specification<Visit> filter = Specification.where(doctorFilter).and(patientFilter).and(dateFilter).and(statusFilter);
		var sortOrder = Sort.by(params.sortOrder, Visit.appointmentDate_);

		///limit the query to maxLimit, starting at offset 0. limit of <= 0 is invalid and assumes maxLimit.
		Pageable sortedLimit = PageRequest.of(0, params.limit <= 0 || params.limit > maxFetchLimit ? maxFetchLimit : params.limit, sortOrder);

		return visitRepository.findAll(filter, sortedLimit).getContent();
	}
}
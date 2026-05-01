package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.visit.request.CreateVisitRequest;
import pl.polsl.clinic.entity.*;
import pl.polsl.clinic.enums.VisitStatus;
import pl.polsl.clinic.exception.InvalidParametersException;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.repository.*;
import pl.polsl.clinic.dto.visit.request.UpdateVisitRequest;
import pl.polsl.clinic.dto.visit.response.VisitDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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

	public Optional<Visit> getById(Long id) {
		return visitRepository.findById(id);
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

	@Data
	@Builder
	public static final class VisitParams {
		private final Long doctorId;
		private final Long patientId;
		private final LocalDate fromDate;
		private final LocalDate toDate;
		private final VisitStatus status;
		private Integer limit = maxFetchLimit;
		private Sort.Direction sortOrder = Sort.Direction.ASC;

		/// Override one build method and default values
		public static class VisitParamsBuilder {
			private LocalDate fromDate;
			private LocalDate toDate;
			private Sort.Direction sortOrder = Sort.Direction.ASC;
			private Integer limit = maxFetchLimit;

			public VisitParamsBuilder date(LocalDate date) {
				this.fromDate = date;
				this.toDate = date;
				return this;
			}
		}
	}


	/// @param params the limit field is used to fetch \[1, maxLimit\] of rows, any value outside that range will become maxLimit.
	public Iterable<Visit> getMatchingVisits(@NonNull VisitParams params) {
		//confirm requested parameters entities exist
		if (params.doctorId != null && !doctorRepository.existsById(params.doctorId))
			throw new ItemNotFoundException(Doctor.class, params.doctorId);
		if (params.patientId != null && !patientRepository.existsById(params.patientId))
			throw new ItemNotFoundException(Patient.class, params.patientId);

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

	public record ModifyVisitDoctorRequest(Long visitId, String description, String diagnosis) {
		public Visit updateEntity(Visit visit) {
			visit.setDescription(description);
			visit.setDiagnosis(diagnosis);
			return visit;
		}
	}

	public void ModifyVisitDoctor(ModifyVisitDoctorRequest request, VisitStatus newStatus) {
		Visit visit = visitRepository.findById(request.visitId()).orElseThrow(() -> new ItemNotFoundException(Visit.class, request.visitId()));
		var currentStatus = visit.getStatus();
		if ((newStatus.equals(VisitStatus.In_Progress) || newStatus.equals(VisitStatus.Registered)) &&
			(currentStatus.equals(VisitStatus.Finished) || currentStatus.equals(VisitStatus.Cancelled))) {
			throw new InvalidParametersException("Can not move to an earlier visit state.");
		}
		visit.setStatus(newStatus);
		visitRepository.save(request.updateEntity(visit));
	}
}

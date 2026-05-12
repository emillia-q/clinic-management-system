package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.doctor.request.AddLabExamRequest;
import pl.polsl.clinic.dto.lab.response.LabExamDto;
import pl.polsl.clinic.entity.LabExam;
import pl.polsl.clinic.entity.LaboratoryExamDict;
import pl.polsl.clinic.entity.Visit;
import pl.polsl.clinic.enums.LabExamStatus;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.exception.InvalidParametersException;
import pl.polsl.clinic.repository.LabExamRepository;
import pl.polsl.clinic.repository.LaboratoryExamDictRepository;
import pl.polsl.clinic.repository.VisitRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LabService {
	private final LabExamRepository labExamRepository;
	private final VisitRepository visitRepository;
	private final LaboratoryExamDictRepository laboratoryExamDictRepository;

	public List<LabExamDto> getExamsByStatus(LabExamStatus status) {
		return labExamRepository.findByStatus(status.name()).stream()
			.map(LabExamDto::fromEntity)
			.toList();
	}

	@Transactional
	public void submitResult(Long id, String result) {
		LabExam exam = labExamRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
		exam.setResult(result);
		exam.setStatus(LabExamStatus.Completed.name());
		exam.setExecutionCancelDate(LocalDateTime.now());
		labExamRepository.save(exam);
	}

	@Transactional
	public void cancelExam(Long id) {
		LabExam exam = labExamRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
		exam.setStatus(LabExamStatus.Cancelled.name());
		exam.setExecutionCancelDate(LocalDateTime.now());
		labExamRepository.save(exam);
	}

	@Transactional
	public void approveExam(Long id, String managerNotes) {
		LabExam exam = labExamRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
		exam.setManagerNotes(managerNotes);
		exam.setStatus(LabExamStatus.Validated.name());
		labExamRepository.save(exam);
	}

	@Transactional
	public void rejectExam(Long id, String managerNotes) {
		if (managerNotes == null || managerNotes.trim().isEmpty()) {
			throw new InvalidParametersException("Manager notes are required for rejection.");
		}
		LabExam exam = labExamRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
		exam.setManagerNotes(managerNotes);
		exam.setStatus(LabExamStatus.Rejected.name());
		labExamRepository.save(exam);
	}

	public LabExam add(@NonNull @Valid AddLabExamRequest request) {
		var visit = visitRepository.findById(request.getVisitId())
			.orElseThrow(() -> new ItemNotFoundException(Visit.class, request.getVisitId()));
		var examType = laboratoryExamDictRepository.findById(request.getExamCode()).
			orElseThrow(() -> new ItemNotFoundException(LaboratoryExamDict.class, request.getExamCode()));
		LabExam labExam = new LabExam();
		labExam.setVisit(visit);
		labExam.setExamDict(examType);
		labExam.setDoctorNotes(request.getDoctorNotes());
		return labExamRepository.save(labExam);
	}

	public LabExam getById(Long id) {
		return labExamRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
	}
}
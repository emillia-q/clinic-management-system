package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.doctor.request.AddLabExamRequest;
import pl.polsl.clinic.dto.lab.response.LabExamDetailsDto;
import pl.polsl.clinic.entity.*;
import pl.polsl.clinic.enums.LabExamStatus;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.exception.InvalidParametersException;
import pl.polsl.clinic.repository.*;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LabService {
	private final LabExamRepository labExamRepository;
	private final VisitRepository visitRepository;
	private final LaboratoryExamDictRepository laboratoryExamDictRepository;
	private final LabTechnicianRepository labTechnicianRepository;
	private final LabManagerRepository labManagerRepository;

	public List<LabExamDetailsDto> getExamsByStatus(LabExamStatus status) {
		return labExamRepository.findByStatus(status.name()).stream()
			.map(LabExamDetailsDto::fromEntity)
			.toList();
	}

	@Transactional
	public void submitResult(Long id, String result, Long userId) {
		LabExam exam = labExamRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
		exam.setResult(result);
		exam.setStatus(LabExamStatus.Completed.name());
		exam.setExecutionCancelDate(LocalDateTime.now());
		var technician = labTechnicianRepository.findById(userId).orElseThrow(() -> new ItemNotFoundException(LabTechnician.class, userId));
		exam.setLabTechnician(technician);
		labExamRepository.save(exam);
	}

	@Transactional
	public void cancelExam(Long id, Long userId) {
		LabExam exam = labExamRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
		exam.setStatus(LabExamStatus.Canceled.name());
		exam.setExecutionCancelDate(LocalDateTime.now());
		var technician = labTechnicianRepository.findById(userId).orElseThrow(() -> new ItemNotFoundException(LabTechnician.class, userId));
		exam.setLabTechnician(technician);
		labExamRepository.save(exam);
	}

	@Transactional
	public void approveExam(Long id, String managerNotes, Long userId) {
		LabExam exam = labExamRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
		exam.setManagerNotes(managerNotes);
		exam.setStatus(LabExamStatus.Validated.name());
		var manager = labManagerRepository.findById(userId).orElseThrow(() -> new ItemNotFoundException(LabManager.class, userId));
		exam.setLabManager(manager);
		labExamRepository.save(exam);
	}

	@Transactional
	public void rejectExam(Long id, String managerNotes, Long userId) {
		if (managerNotes == null || managerNotes.trim().isEmpty()) {
			throw new InvalidParametersException("Manager notes are required for rejection.");
		}
		LabExam exam = labExamRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
		exam.setManagerNotes(managerNotes);
		exam.setStatus(LabExamStatus.Rejected.name());
		var manager = labManagerRepository.findById(userId).orElseThrow(() -> new ItemNotFoundException(LabManager.class, userId));
		exam.setLabManager(manager);
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
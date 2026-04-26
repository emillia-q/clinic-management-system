package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.lab.response.LabExamDto;
import pl.polsl.clinic.entity.LabExam;
import pl.polsl.clinic.enums.LabExamStatus;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.exception.InvalidParametersException;
import pl.polsl.clinic.repository.LabExamRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LabService {
	private final LabExamRepository labExamRepository;

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
}
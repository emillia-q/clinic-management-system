package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.LabExamDto;
import pl.polsl.clinic.entity.LabExam;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.repository.LabExamRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabService {
	private final LabExamRepository labExamRepository;

	public List<LabExamDto> getExamsByStatus(String status) {
		return labExamRepository.findByStatus(status).stream()
			.map(LabExamDto::fromEntity)
			.toList();
	}

	@Transactional
	public void submitResult(Long id, String result) {
		LabExam exam = labExamRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
		exam.setResult(result);
		exam.setStatus("Completed");
		labExamRepository.save(exam);
	}

	@Transactional
	public void approveExam(Long id, String managerNotes) {
		LabExam exam = labExamRepository.findById(id)
			.orElseThrow(() -> new ItemNotFoundException(LabExam.class, id));
		exam.setManagerNotes(managerNotes);
		exam.setStatus("Validated");
		labExamRepository.save(exam);
	}
}
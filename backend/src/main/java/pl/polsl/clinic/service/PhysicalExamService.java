package pl.polsl.clinic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.requests.AddPhysicalExamRequest;
import pl.polsl.clinic.entity.ExamDict;
import pl.polsl.clinic.entity.PhysicalExam;
import pl.polsl.clinic.entity.PhysicalExamDict;
import pl.polsl.clinic.entity.Visit;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.repository.PhysicalExamDictRepository;
import pl.polsl.clinic.repository.PhysicalExamRepository;
import pl.polsl.clinic.repository.VisitRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PhysicalExamService {
	private final PhysicalExamRepository physicalExamRepository;
	private final PhysicalExamDictRepository physicalExamDictRepository;
	private final VisitRepository visitRepository;

	public List<PhysicalExam> findAll() {
		return physicalExamRepository.findAll();
	}

	public Optional<PhysicalExam> findById(Long id) {
		return physicalExamRepository.findById(id);
	}

	public PhysicalExam add(AddPhysicalExamRequest physicalExam) {
		var visit = visitRepository.findById(physicalExam.getVisitId())
			.orElseThrow(() -> new ItemNotFoundException(Visit.class, physicalExam.getVisitId()));
		var examType = physicalExamDictRepository.findById(physicalExam.getExamCode())
			.orElseThrow(() -> new ItemNotFoundException(PhysicalExamDict.class, physicalExam.getExamCode()));

		PhysicalExam physicalExam1 = new PhysicalExam();
		physicalExam1.setExamDict(examType);
		physicalExam1.setVisit(visit);
		physicalExam1.setResult(physicalExam.getResult());

		return physicalExamRepository.save(physicalExam1);
	}
}

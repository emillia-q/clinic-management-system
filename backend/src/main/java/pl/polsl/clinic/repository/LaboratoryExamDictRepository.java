package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.LaboratoryExamDict;

@Repository
public interface LaboratoryExamDictRepository extends SpecificationJpaRepository<LaboratoryExamDict, String> {
	// findAll() will only return Laboratory exams
}

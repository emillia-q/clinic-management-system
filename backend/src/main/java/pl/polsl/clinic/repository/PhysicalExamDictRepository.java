package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.PhysicalExamDict;

@Repository
public interface PhysicalExamDictRepository extends SpecificationJpaRepository<PhysicalExamDict, String> {
	// findAll() will only return Physical exams
}

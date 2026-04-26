package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.PhysicalExam;

@Repository
public interface PhysicalExamRepository extends SpecificationJpaRepository<PhysicalExam, Long> {
}

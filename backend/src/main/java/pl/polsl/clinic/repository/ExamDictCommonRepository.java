package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.ExamDict;

@Repository
public interface ExamDictCommonRepository extends SpecificationJpaRepository<ExamDict, String> {
}

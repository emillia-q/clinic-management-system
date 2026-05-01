package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Visit;

@Repository
public interface VisitRepository extends SpecificationJpaRepository<Visit, Long> {
}
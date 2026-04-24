package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Patient;

@Repository
public interface PatientRepository extends SpecificationJpaRepository<Patient, Long> {
}

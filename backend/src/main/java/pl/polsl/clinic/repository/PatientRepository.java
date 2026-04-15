package pl.polsl.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

}

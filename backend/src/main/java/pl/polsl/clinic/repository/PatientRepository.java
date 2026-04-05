package pl.polsl.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Patient;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
	List<Patient> findByFirstNameAndLastName(String firstName, String lastName);
	Optional<Patient> findBySocialSecurityNo(String socialSecurityNo);
}

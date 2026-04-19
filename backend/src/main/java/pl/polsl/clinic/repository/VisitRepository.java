package pl.polsl.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Visit;

import pl.polsl.clinic.enums.VisitStatus;
import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
	List<Visit> findByStatus(VisitStatus status);

	List<Visit> findByPatientPatientIdOrderByAppointmentDateDesc(Long patientId);
}
package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Visit;

import pl.polsl.clinic.enums.VisitStatus;
import java.util.List;

@Repository
public interface VisitRepository extends SpecificationJpaRepository<Visit, Long> {
	List<Visit> findByStatus(VisitStatus status);

	List<Visit> findByPatientPatientIdOrderByAppointmentDateDesc(Long patientId);
}
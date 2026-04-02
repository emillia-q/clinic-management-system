package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Doctor;

import java.util.Optional;

@Repository
public interface DoctorRepository extends StaffBaseRepository<Doctor> {
	Optional<Doctor> findByLicenseNo(String licenseNo);
}

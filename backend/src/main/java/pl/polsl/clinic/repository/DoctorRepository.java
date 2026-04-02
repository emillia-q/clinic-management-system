package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Doctor;

@Repository
public interface DoctorRepository extends StaffBaseRepository<Doctor> {
}

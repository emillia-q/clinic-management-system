package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.LabTechnician;

@Repository
public interface LabTechnicianRepository extends StaffBaseRepository<LabTechnician> {
}

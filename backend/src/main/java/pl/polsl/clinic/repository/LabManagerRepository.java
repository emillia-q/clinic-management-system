package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.LabManager;

@Repository
public interface LabManagerRepository extends StaffBaseRepository<LabManager> {
}

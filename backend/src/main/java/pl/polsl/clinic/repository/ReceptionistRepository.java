package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Receptionist;

@Repository
public interface ReceptionistRepository extends StaffBaseRepository<Receptionist> {
}

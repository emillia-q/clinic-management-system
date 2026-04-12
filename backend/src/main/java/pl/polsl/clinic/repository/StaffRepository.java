package pl.polsl.clinic.repository;

import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Staff;

@Repository
public interface StaffRepository extends StaffBaseRepository<Staff>{
	boolean existsByLogin(String login);
}

package pl.polsl.clinic.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.Staff;
import pl.polsl.clinic.enums.UserType;

import java.util.List;

@Repository
public interface StaffRepository extends StaffBaseRepository<Staff>{
	boolean existsByLogin(String login);

	@Query("SELECT s FROM Staff s WHERE " +
		"(:type IS NULL OR s.userType = :type) AND " +
		"(LOWER(s.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
		" LOWER(s.lastName) LIKE LOWER(CONCAT('%', :query, '%')))")
	List<Staff> findByRoleAndQuery(@Param("type") UserType type, @Param("query") String query);
}

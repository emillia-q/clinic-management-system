package pl.polsl.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import pl.polsl.clinic.entity.Staff;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface StaffBaseRepository<T extends Staff> extends JpaRepository<T, Long> {
	// common queries that will be available to all subclasses

	Optional<T> findByLogin(String login);

	List<T> findByIsActiveTrue();

	List<T> findByFirstNameAndLastName(String firstName, String lastName);

}

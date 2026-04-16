package pl.polsl.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;

@NoRepositoryBean
public interface SpecificationJpaRepository<T, ID extends Serializable>
	extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {
	// Inherits:
	// - List<T> findAll() (from JpaRepository)
	// - List<T> findAll(Specification<T> spec) (from JpaSpecificationExecutor)
}

package pl.polsl.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface QuerydslJpaRepository<T, Tkey> extends JpaRepository<T, Tkey>, QuerydslPredicateExecutor<T> {
}

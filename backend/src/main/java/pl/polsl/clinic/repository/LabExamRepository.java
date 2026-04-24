package pl.polsl.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.polsl.clinic.entity.LabExam;

import java.util.List;

@Repository
public interface LabExamRepository extends JpaRepository<LabExam, Long> {
	List<LabExam> findByStatus(String status);
}
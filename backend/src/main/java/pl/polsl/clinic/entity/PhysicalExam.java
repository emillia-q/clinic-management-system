package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "physical_exam")
@Getter
@Setter
@NoArgsConstructor
public class PhysicalExam {
	@Id
	@Column(name = "physical_exam_id")
	private Long physicalExamId;

	@ManyToOne
	@JoinColumn(name = "visit_visit_id", nullable = false)
	private Visit visit;

	@ManyToOne
	@JoinColumn(name = "exam_dict_exam_code", nullable = false)
	private ExamDict examDict;

	@Column(name = "result", columnDefinition = "TEXT")
	private String result;
}

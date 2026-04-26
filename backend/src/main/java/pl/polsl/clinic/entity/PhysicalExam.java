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
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "physical_exam_id")
	private Long physicalExamId;
	static public final String physicalExamId_ = "physicalExamId";

	@ManyToOne
	@JoinColumn(name = "visit_visit_id", nullable = false)
	private Visit visit;
	static public final String visit_ = "visit";

	@ManyToOne
	@JoinColumn(name = "exam_dict_exam_code", nullable = false)
	private ExamDict examDict;
	static public final String examDict_ = "examDict";

	@Column(name = "result", columnDefinition = "TEXT")
	private String result;
	static public final String result_ = "result";
}

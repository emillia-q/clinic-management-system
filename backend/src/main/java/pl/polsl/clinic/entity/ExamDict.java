package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "exam_dict")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Single Table Inheritance ('L' or 'P')
// This auto creates the examType(exam_type) column
@DiscriminatorColumn(name = "exam_type", discriminatorType = DiscriminatorType.STRING, length = 1)
@Getter
@Setter
@NoArgsConstructor
public class ExamDict {
	@Id
	@Column(name = "exam_code", length = 20)
	private String examCode;
	static public final String examCode_ = "examCode";

	@Column(name = "exam_name", nullable = false, length = 255)
	private String examName;
	static public final String examName_ = "examName";
}

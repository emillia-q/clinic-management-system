package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;

@Entity
@Table(name = "ExamDict")
public class ExamDict {
	@Id
	@Max(20)
	private String examCode;

	@Enumerated(EnumType.STRING)
//	@Column(length = 1)
	private ExamType examType;

	private String examName;
}

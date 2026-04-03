package pl.polsl.clinic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "exam_dict")
@Getter
@Setter
@NoArgsConstructor
public class ExamDict {
	@Id
	@Column(name = "exam_code", length = 20)
	private String examCode;

	@Column(name = "exam_type", nullable = false, length = 1)
	private String examType; // 'L' or 'P'

	@Column(name = "exam_name", nullable = false, length = 255)
	private String examName;
}

package pl.polsl.clinic.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "PhysicalExam")
public class PhysicalExam {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long physicalExamID;

	@ManyToOne
	@JoinColumn(name = "Visit_VisitID")
	private Visit visit; 

	@ManyToOne
	@JoinColumn(name = "ExamDict_ExamCode")
	private ExamDict examDict;

	@Lob
	private String result; 
}

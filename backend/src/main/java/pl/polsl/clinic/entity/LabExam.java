package pl.polsl.clinic.entity;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "LabExam")
public class LabExam {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long labExamID; 

	@ManyToOne
	@JoinColumn(name = "Visit_VisitID")
	private Visit visit; 

	@ManyToOne
	@JoinColumn(name = "ExamDict_ExamCode")
	private ExamDict examDict;

	@Lob
	private String doctorNotes; 
	private OffsetDateTime orderDate; // UTC [cite: 14, 15]

	@Lob
	private String result; 
	private OffsetDateTime analysisCancelDate; // UTC [cite: 18, 19]

	@Lob
	private String managerNotes; 
	private OffsetDateTime approvalCancelDate; // UTC [cite: 21, 22]

	private String status;

	@ManyToOne
	@JoinColumn(name = "LabTechnician_UserID")
	private LabTechnician technician; 

	@ManyToOne
	@JoinColumn(name = "LabManager_UserID")
	private LabManager manager; 
}

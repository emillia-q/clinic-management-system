package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_exam")
@Getter
@Setter
@NoArgsConstructor
public class LabExam {
	@Id
	@Column(name = "lab_exam_id")
	private Long labExamId;

	@ManyToOne
	@JoinColumn(name = "visit_visit_id", nullable = false)
	private Visit visit;

	@ManyToOne
	@JoinColumn(name = "exam_dict_exam_code", nullable = false)
	private ExamDict examDict;

	@Column(name = "doctor_notes", columnDefinition = "TEXT")
	private String doctorNotes;

	@Column(name = "order_date", nullable = false)
	private LocalDateTime orderDate;

	@Column(name = "result", columnDefinition = "TEXT")
	private String result;

	@Column(name = "execution_cancel_date")
	private LocalDateTime executionCancelDate;

	@Column(name = "manager_notes", columnDefinition = "TEXT")
	private String managerNotes;

	@Column(name = "approval_rejection_date")
	private LocalDateTime approvalRejectionDate;

	@Column(name = "status", nullable = false, length = 50)
	private String status;

	@ManyToOne
	@JoinColumn(name = "lab_technician_user_id")
	private LabTechnician labTechnician;

	@ManyToOne
	@JoinColumn(name = "lab_manager_user_id")
	private LabManager labManager;
}

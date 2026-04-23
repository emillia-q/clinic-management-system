package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import pl.polsl.clinic.enums.LabExamStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_exam")
@Getter
@Setter
@NoArgsConstructor
public class LabExam {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "lab_exam_id")
	private Long labExamId;

	@NonNull
	@ManyToOne
	@JoinColumn(name = "visit_visit_id", nullable = false)
	private Visit visit;

	@NonNull
	@ManyToOne
	@JoinColumn(name = "exam_dict_exam_code", nullable = false)
	private ExamDict examDict;

	@Column(name = "doctor_notes", columnDefinition = "TEXT")
	private String doctorNotes;

	@CreationTimestamp // auto set LocalDateTime.now()
	@Column(name = "order_date", nullable = false, updatable = false)
	private LocalDateTime orderDate;

	@Column(name = "result", columnDefinition = "TEXT")
	private String result;

	@Column(name = "execution_cancel_date")
	private LocalDateTime executionCancelDate;

	@Column(name = "manager_notes", columnDefinition = "TEXT")
	private String managerNotes;

	@Column(name = "approval_rejection_date")
	private LocalDateTime approvalRejectionDate;

	@NonNull
	@Column(name = "status", nullable = false, length = 50)
	private String status = LabExamStatus.Ordered.name();

	@ManyToOne
	@JoinColumn(name = "lab_technician_user_id")
	private LabTechnician labTechnician;

	@ManyToOne
	@JoinColumn(name = "lab_manager_user_id")
	private LabManager labManager;
}

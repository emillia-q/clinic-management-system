package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.polsl.clinic.enums.VisitStatus;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "visit")
@Getter
@Setter
@NoArgsConstructor
public class Visit {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "visit_id")
	private Long visitId;
	static public final String visitId_ = "visitId";

	@ManyToOne  // 50/50 wanted now vs never
	@JoinColumn(name = "patient_patient_id", nullable = false)
	private Patient patient;
	static public final String patient_ = "patient";

	@ManyToOne  // 50/50 wanted now vs never
	@JoinColumn(name = "doctor_user_id", nullable = false)
	private Doctor doctor;
	static public final String doctor_ = "doctor";

	@ManyToOne(fetch = FetchType.LAZY)  //never wanted
	@JoinColumn(name = "receptionist_user_id", nullable = false)
	private Receptionist receptionist;
	static public final String receptionist_ = "receptionist";

	@Column(name = "description", nullable = false, columnDefinition = "TEXT")
	private String description;
	static public final String description_ = "description";

	@Column(name = "diagnosis", columnDefinition = "TEXT")
	private String diagnosis;
	static public final String diagnosis_ = "diagnosis";

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 50)
	private VisitStatus status = VisitStatus.Registered;
	static public final String status_ = "status";

	@Column(name = "registration_date", nullable = false)
	private LocalDateTime registrationDate;
	static public final String registrationDate_ = "registrationDate";

	@Column(name = "appointment_date", nullable = false)
	private LocalDateTime appointmentDate;
	static public final String appointmentDate_ = "appointmentDate";

	@Column(name = "completion_cancel_date")
	private LocalDateTime completionCancelDate;
	static public final String completionCancelDate_ = "completionCancelDate";


	@OneToMany(mappedBy = "visit")
	private List<LabExam> labExams;
	static public final String labExams_ = "labExams";

	@OneToMany(mappedBy = "visit")
	private List<PhysicalExam> physicalExams;
	static public final String physicalExams_ = "physicalExams";
}

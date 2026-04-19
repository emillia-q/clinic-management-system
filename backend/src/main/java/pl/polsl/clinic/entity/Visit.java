package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.polsl.clinic.enums.VisitStatus;
import java.time.LocalDateTime;

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

	@ManyToOne
	@JoinColumn(name = "patient_patient_id", nullable = false)
	private Patient patient;

	@ManyToOne
	@JoinColumn(name = "doctor_user_id", nullable = false)
	private Doctor doctor;

	@ManyToOne
	@JoinColumn(name = "receptionist_user_id", nullable = false)
	private Receptionist receptionist;

	@Column(name = "description", nullable = false, columnDefinition = "TEXT")
	private String description;

	@Column(name = "diagnosis", columnDefinition = "TEXT")
	private String diagnosis;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 50)
	private VisitStatus status = VisitStatus.Registered;

	@Column(name = "registration_date", nullable = false)
	private LocalDateTime registrationDate;

	@Column(name = "appointment_date", nullable = false)
	private LocalDateTime appointmentDate;

	@Column(name = "completion_cancel_date")
	private LocalDateTime completionCancelDate;
}
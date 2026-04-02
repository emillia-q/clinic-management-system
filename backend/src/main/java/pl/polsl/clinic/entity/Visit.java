package pl.polsl.clinic.entity;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "Visit")
public class Visit {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long visitID;

	@ManyToOne
	@JoinColumn(name = "Patient_PatientID")
	private Patient patient;

	@Lob
	private String description; 
	@Lob
	private String diagnosis; 

	private String status; 

	private OffsetDateTime registrationDate; // UTC [cite: 94, 95]
	private OffsetDateTime completionCancelDate; // UTC [cite: 97, 99]

	@ManyToOne
	@JoinColumn(name = "Doctor_UserID")
	private Doctor doctor;

	@ManyToOne
	@JoinColumn(name = "Receptionist_UserID")
	private Receptionist receptionist;
}

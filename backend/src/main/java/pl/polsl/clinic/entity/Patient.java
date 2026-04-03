package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "patient")
@Getter
@Setter
@NoArgsConstructor
public class Patient {
	@Id
	@Column(name = "patient_id")
	private Long patientId;

	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;

	@Column(name = "social_security_no", nullable = false, unique = true, length = 11)
	private String socialSecurityNo;

	@Column(name = "date_of_birth", nullable = false)
	private LocalDate dateOfBirth;

	@Column(name = "email", length = 100)
	private String email;

	@Column(name = "phone_number", nullable = false, length = 15)
	private String phoneNumber;

	@OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
	private Address address;
}

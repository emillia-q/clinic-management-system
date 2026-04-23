package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "patient")
@Getter
@Setter
@NoArgsConstructor
public class Patient {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "patient_id")
	private Long patientId;
	static public final String patientId_ = "patientId";

	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;
	static public final String firstName_ = "firstName";

	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;
	static public final String lastName_ = "lastName";

	@Column(name = "social_security_no", nullable = false, unique = true, length = 11)
	private String socialSecurityNo;
	static public final String socialSecurityNo_ = "socialSecurityNo";

	@Column(name = "date_of_birth", nullable = false)
	private LocalDate dateOfBirth;
	static public final String dateOfBirth_ = "dateOfBirth";

	@Column(name = "email", length = 100)
	private String email;
	static public final String email_ = "email";

	@Column(name = "phone_number", nullable = false, length = 15)
	private String phoneNumber;
	static public final String phoneNumber_ = "phoneNumber";


	@OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
	private Address address;
	static public final String address_ = "address";

	@OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
	private List<Visit> visits;
	static public final String visits_ = "visits";
}

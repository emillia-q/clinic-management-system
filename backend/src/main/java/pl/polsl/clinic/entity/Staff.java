package pl.polsl.clinic.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "Staff")
@Inheritance(strategy = InheritanceType.JOINED)
public class Staff {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userID;

	private String firstName;
	private String lastName;

	@Column(unique = true)
	private String login;

	private String password;

	private Boolean isActive;

	private String userType;
}


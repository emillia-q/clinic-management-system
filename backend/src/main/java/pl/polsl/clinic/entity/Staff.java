package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "Staff")
@Data
@Inheritance(strategy = InheritanceType.JOINED)
public class Staff {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userID;

	@NotNull
	private String firstName;
	@NotNull
	private String lastName;

	@NotNull
	@Column(unique = true)
	private String login;
	@NotNull
	private String password;

	@NotNull
	private Boolean isActive = true;

	private String userType;
}


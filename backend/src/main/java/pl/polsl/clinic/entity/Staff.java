package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.polsl.clinic.enums.UserType;

@Entity
@Table(name = "staff")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
public class Staff {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long userId;
	static public final String userId_ = "userId";

	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;
	static public final String firstName_ = "firstName";

	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;
	static public final String lastName_ = "lastName";

	@Column(name = "login", nullable = false, unique = true, length = 100)
	private String login;
	static public final String login_ = "login";

	@Column(name = "password", nullable = false, length = 100)
	private String password;
	static public final String password_ = "password";

	@Column(name = "is_active", nullable = false, length = 1)
	private String isActive = "Y";
	static public final String isActive_ = "isActive";

	@Enumerated(EnumType.STRING)
	@Column(name = "user_type", nullable = false, length = 50)
	private UserType userType;
	static public final String userType_ = "userType";

	@Column(name = "passwd_change_required", length = 1)
	private String passwdChangeRequired = "Y";
	static public final String passwdChangeRequired_ = "passwdChangeRequired";
}
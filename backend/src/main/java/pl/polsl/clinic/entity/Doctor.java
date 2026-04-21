package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "doctor")
@PrimaryKeyJoinColumn(name = "staff_user_id")
@Getter
@Setter
@NoArgsConstructor
public class Doctor extends Staff {
	@Column(name = "license_no", unique = true, nullable = false, length = 7)
	private String licenseNo;
	static public final String licenseNo_ = "licenseNo";

	@OneToMany(mappedBy = "doctor")
	private List<Visit> visits;
	static public final String visits_ = "visits";
}



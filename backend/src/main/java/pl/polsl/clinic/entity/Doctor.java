package pl.polsl.clinic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doctor")
@PrimaryKeyJoinColumn(name = "staff_user_id")
@Getter
@Setter
@NoArgsConstructor
public class Doctor extends Staff {
	@Column(name = "license_no", unique = true, nullable = false, length = 7)
	private String licenseNo;
}



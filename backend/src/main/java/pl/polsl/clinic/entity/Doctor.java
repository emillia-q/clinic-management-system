package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Table(name = "Doctor")
@EqualsAndHashCode(callSuper = true)
@Data
public class Doctor extends Staff {
	@NotNull
	@Column(unique = true, length = 7)
	private String licenseNo;

	@OneToMany
	@JoinColumn(name = "Doctor_UserID")
	private List<Visit> visits;
}

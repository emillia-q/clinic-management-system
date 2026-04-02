package pl.polsl.clinic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Doctor")
public class Doctor extends Staff {
	@Column(unique = true, length = 7)
	private String licenseNo;
}

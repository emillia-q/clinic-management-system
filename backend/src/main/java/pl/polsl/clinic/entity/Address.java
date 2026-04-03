package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
@NoArgsConstructor
public class Address {
	@Id
	@Column(name = "patient_patient_id")
	private Long patientPatientId;

	@OneToOne
	@MapsId
	@JoinColumn(name = "patient_patient_id")
	private Patient patient;

	@Column(name = "city", nullable = false, length = 100)
	private String city;

	@Column(name = "street", nullable = false, length = 100)
	private String street;

	@Column(name = "house_no", nullable = false, length = 10)
	private String houseNo;

	@Column(name = "apartment_no", length = 10)
	private String apartmentNo;
}

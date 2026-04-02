package pl.polsl.clinic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Address")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
	@JsonIgnore
	@Id
	private Long patientID;

	@JsonIgnore
	@OneToOne
	@MapsId
	@JoinColumn(name = "Patient_PatientID")
	private Patient patient;

	private String city;
	private String street;
	private Integer houseNo;

	@Null
	private Integer apartmentNo;
}

package pl.polsl.clinic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long patientID;

	private String firstName; 
	private String lastName;

	@Column(unique = true, length = 11)
	private String socialSecurityNo; 

	private LocalDate dateOfBirth; 
	private String email;
	private String phoneNumber; 

	@OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
	@PrimaryKeyJoinColumn
	private Address address;
}

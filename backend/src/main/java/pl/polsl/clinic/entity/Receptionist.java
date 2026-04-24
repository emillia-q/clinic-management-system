package pl.polsl.clinic.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "receptionist")
@PrimaryKeyJoinColumn(name = "staff_user_id")
@Getter
@Setter
@NoArgsConstructor
public class Receptionist extends Staff {

	@OneToMany(mappedBy = "receptionist")
	private List<Visit> visits;
}

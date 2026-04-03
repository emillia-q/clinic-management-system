package pl.polsl.clinic.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lab_manager")
@PrimaryKeyJoinColumn(name = "staff_user_id")
@Getter
@Setter
@NoArgsConstructor
public class LabManager extends Staff {
}

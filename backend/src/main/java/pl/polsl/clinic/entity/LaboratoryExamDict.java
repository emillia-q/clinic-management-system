package pl.polsl.clinic.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("L") // Automatically sets exam_type to 'L' on save
public class LaboratoryExamDict extends ExamDict {
	// lab-specific logic or fields 
}

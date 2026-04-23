package pl.polsl.clinic.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("P") // Automatically sets exam_type to 'P' on save
public class PhysicalExamDict extends ExamDict {
	// physical-specific logic or fields 
}

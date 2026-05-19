package pl.polsl.clinic.dto.lab.request;

import jakarta.validation.constraints.NotBlank;
import lombok.NonNull;

public record ManagerExamNotesDto(@NotBlank String notes) {
}

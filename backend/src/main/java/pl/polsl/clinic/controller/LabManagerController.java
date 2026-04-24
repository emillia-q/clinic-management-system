package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.LabExamDto;
import pl.polsl.clinic.enums.LabExamStatus;
import pl.polsl.clinic.service.LabService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/lab-manager")
public class LabManagerController {
	private final LabService labService;

	@GetMapping("/exams/to-verify")
	@Operation(summary = "Get list of exams to validate (Completed)")
	public List<LabExamDto> getToVerify() {
		return labService.getExamsByStatus(LabExamStatus.Completed);
	}

	@PatchMapping("/exams/{id}/approve")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Approve lab result")
	public void approve(@PathVariable Long id, @RequestBody(required = false) String notes) {
		labService.approveExam(id, notes);
	}

	@PatchMapping("/exams/{id}/reject")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Reject lab result (Notes required)") //
	public void reject(@PathVariable Long id, @RequestBody String notes) {
		labService.rejectExam(id, notes);
	}
}
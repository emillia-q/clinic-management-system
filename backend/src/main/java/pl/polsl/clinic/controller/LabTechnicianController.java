package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.LabExamDto;
import pl.polsl.clinic.service.LabService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/lab-technician")
public class LabTechnicianController {

	private final LabService labService;

	@GetMapping("/exams/pending")
	@Operation(summary = "Get list of exams to perform")
	public List<LabExamDto> getPending() {
		return labService.getExamsByStatus("Ordered");
	}

	@PatchMapping("/exams/{id}/result")
	@Operation(summary = "Submit test result")
	public void submitResult(@PathVariable Long id, @RequestBody String result) {
		labService.submitResult(id, result);
	}
}
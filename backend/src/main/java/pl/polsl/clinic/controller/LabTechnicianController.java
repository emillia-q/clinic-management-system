package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.lab.response.LabExamDetailsDto;
import pl.polsl.clinic.enums.LabExamStatus;
import pl.polsl.clinic.service.LabService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/lab-technician")
public class LabTechnicianController {
	private final LabService labService;

	@GetMapping("/exams/pending")
	@Operation(summary = "Get list of ordered exams")
	public List<LabExamDetailsDto> getPending() {
		return labService.getExamsByStatus(LabExamStatus.Ordered);
	}

	@PatchMapping("/exams/{id}/result")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Submit result (Execute exam)")
	public void submitResult(@PathVariable Long id, @RequestBody String result) {
		labService.submitResult(id, result);
	}

	@PatchMapping("/exams/{id}/cancel")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Cancel laboratory exam")
	public void cancel(@PathVariable Long id) {
		labService.cancelExam(id);
	}
}
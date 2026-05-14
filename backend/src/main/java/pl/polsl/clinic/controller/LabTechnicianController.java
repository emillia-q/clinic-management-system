package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.lab.response.LabExamDto;
import pl.polsl.clinic.entity.Doctor;
import pl.polsl.clinic.enums.LabExamStatus;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.security.jwt.JwtService;
import pl.polsl.clinic.service.LabService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/lab-technician")
public class LabTechnicianController {
	private final LabService labService;
	private final JwtService jwtService;

	@GetMapping("/exams/pending")
	@Operation(summary = "Get list of ordered exams")
	public List<LabExamDto> getPending() {
		return labService.getExamsByStatus(LabExamStatus.Ordered);
	}

	@PatchMapping("/exams/{id}/result")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Submit result (Execute exam)")
	public void submitResult(@PathVariable Long id, @RequestBody String result, HttpServletRequest request) {
		var jwt = jwtService.getTokenFromRequest(request).orElseThrow(() -> new ItemNotFoundException(Doctor.class, "Auth Header missing"));
		labService.submitResult(id, result, jwtService.extractUserId(jwt));
	}

	@PatchMapping("/exams/{id}/cancel")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Cancel laboratory exam")
	public void cancel(@PathVariable Long id, HttpServletRequest request) {
		var jwt = jwtService.getTokenFromRequest(request).orElseThrow(() -> new ItemNotFoundException(Doctor.class, "Auth Header missing"));
		labService.cancelExam(id, jwtService.extractUserId(jwt));
	}
}
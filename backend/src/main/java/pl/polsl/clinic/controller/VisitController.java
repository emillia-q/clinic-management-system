package pl.polsl.clinic.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.VisitDto;
import pl.polsl.clinic.dto.requests.CreateVisitRequest;
import pl.polsl.clinic.service.VisitService;
import pl.polsl.clinic.enums.VisitStatus;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping(path = "/api/v1/visit")
public class VisitController {
	private final VisitService visitService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public VisitDto create(@RequestBody @Valid CreateVisitRequest req) {
		return visitService.createVisit(req);
	}

	@GetMapping
	public List<VisitDto> getAll(@RequestParam(required = false) VisitStatus status) {
		return visitService.getAllVisits(status);
	}

	@PatchMapping("/{id}/cancel")
	public VisitDto cancel(@PathVariable Long id) {
		return visitService.updateStatus(id, VisitStatus.Cancelled);
	}

	@PutMapping("/{id}")
	public VisitDto update(@PathVariable Long id, @RequestBody @Valid CreateVisitRequest req) {
		return visitService.updateVisit(id, req);
	}

	@GetMapping("/patient/{patientId}")
	public List<VisitDto> getHistory(@PathVariable Long patientId) {
		return visitService.getPatientVisitHistory(patientId);
	}
}
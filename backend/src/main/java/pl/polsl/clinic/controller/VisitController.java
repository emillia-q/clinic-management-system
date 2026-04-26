package pl.polsl.clinic.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.visit.request.CreateVisitRequest;
import pl.polsl.clinic.dto.visit.response.VisitDto;
import pl.polsl.clinic.service.VisitService;
import pl.polsl.clinic.enums.VisitStatus;
import java.util.List;
import pl.polsl.clinic.dto.visit.request.UpdateVisitRequest;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping(path = "/api/v1/visits")
public class VisitController {
	private final VisitService visitService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public VisitDto create(@RequestBody @Valid CreateVisitRequest req) {
		return visitService.createVisit(req);
	}

	@GetMapping
	//TODO: change to use getMatchingVisits() instead to reduce redundancy
	public List<VisitDto> getAll(@RequestParam(required = false) VisitStatus status) {
		return visitService.getAllVisits(status);
	}

	@PatchMapping("/{id}/cancel")
	public VisitDto cancel(@PathVariable Long id) {
		return visitService.updateStatus(id, VisitStatus.Cancelled);
	}

	@PutMapping("/{id}")
	public VisitDto update(@PathVariable Long id, @RequestBody @Valid UpdateVisitRequest req) {
		return visitService.updateVisit(id, req);
	}

	@GetMapping("/patient/{patientId}")
	public List<VisitDto> getHistory(@PathVariable Long patientId) {
		return visitService.getPatientVisitHistory(patientId);
	}
}
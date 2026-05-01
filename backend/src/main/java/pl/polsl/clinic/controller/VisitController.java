package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.common.error.ItemNotFoundErrorDetails;
import pl.polsl.clinic.dto.visit.request.CreateVisitRequest;
import pl.polsl.clinic.dto.visit.request.UpdateVisitRequest;
import pl.polsl.clinic.dto.visit.response.VisitDto;
import pl.polsl.clinic.enums.VisitStatus;
import pl.polsl.clinic.service.VisitService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.StreamSupport;

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
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get a list of visits(appointments) that match the parameters. Ordered by appointment date ascending.")
	@ApiResponse(responseCode = "200", description = "List of matching visits", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = VisitDto.class)))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public Iterable<VisitDto> getAll(
		@RequestParam(required = false) Long doctorId,
		@RequestParam(required = false) Long patientId,
		@RequestParam(required = false) LocalDate fromDate, //on date (fromDate===toDate)
		@RequestParam(required = false) LocalDate toDate,
		@RequestParam(required = false) VisitStatus status) {
		var params = VisitService.VisitParams.builder()
			.doctorId(doctorId).patientId(patientId).fromDate(fromDate).toDate(toDate).status(status)
			.build();
		return StreamSupport
			.stream(visitService.getMatchingVisits(params).spliterator(), false)
			.map(VisitDto::fromEntity).toList();
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
		var params = VisitService.VisitParams.builder()
			.patientId(patientId)
			.build();
		return StreamSupport
			.stream(visitService.getMatchingVisits(params).spliterator(), false)
			.map(VisitDto::fromEntity).toList();
	}
}
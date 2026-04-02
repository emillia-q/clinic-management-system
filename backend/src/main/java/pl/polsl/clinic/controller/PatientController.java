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
import pl.polsl.clinic.dto.ItemNotFoundErrorDetails;
import pl.polsl.clinic.dto.PatientDto;
import pl.polsl.clinic.dto.ValidationErrorDetails;
import pl.polsl.clinic.dto.requests.AddPatient;
import pl.polsl.clinic.dto.requests.UpdatePatient;
import pl.polsl.clinic.exceptions.ItemNotFoundException;
import pl.polsl.clinic.service.PatientService;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping(path = "/api/v1/patient")
public class PatientController {
	private final PatientService patientService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Add patient")
	@ApiResponse(responseCode = "201", content = {@Content(schema = @Schema(implementation = PatientDto.class))})
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	@ApiResponse(responseCode = "409", content = @Content)
	public PatientDto add(@RequestBody @Valid AddPatient addPatient) {
		return PatientDto.fromEntity(patientService.add(addPatient));
	}

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get a list of all patients")
	@ApiResponse(responseCode = "200", description = "List of patients", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = PatientDto.class)))})
	public Iterable<PatientDto> getAll() {
		return patientService.findAll().stream().map(PatientDto::fromEntity).toList();
	}

	@GetMapping("{id}")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get patient by id")
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = PatientDto.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public PatientDto getById(@PathVariable Long id) {
		return PatientDto.fromEntity(patientService.findById(id).orElseThrow(() -> new ItemNotFoundException(PatientDto.class, id)));
	}

	@PutMapping
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Update patient")
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = PatientDto.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	@ApiResponse(responseCode = "409", content = @Content)
	public PatientDto update(@RequestBody @Valid UpdatePatient patient) {
		return PatientDto.fromEntity(patientService.update(patient));
	}

}

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
import pl.polsl.clinic.dto.common.error.InvalidParametersErrorDetails;
import pl.polsl.clinic.dto.common.error.ItemNotFoundErrorDetails;
import pl.polsl.clinic.dto.common.error.ValidationErrorDetails;
import pl.polsl.clinic.dto.patient.request.AddPatient;
import pl.polsl.clinic.dto.patient.request.UpdatePatient;
import pl.polsl.clinic.dto.patient.response.PatientDto;
import pl.polsl.clinic.dto.patient.response.PatientGeneralDto;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.service.PatientService;
import pl.polsl.clinic.validator.PESEL;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping(path = "/api/v1/patients")
public class PatientController {
	private final PatientService patientService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Add patient")
	@ApiResponse(responseCode = "201", content = {@Content(schema = @Schema(implementation = PatientGeneralDto.class))})
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	@ApiResponse(responseCode = "409", content = @Content)
	public PatientGeneralDto add(@RequestBody @Valid AddPatient addPatient) {
		return PatientGeneralDto.fromEntity(patientService.add(addPatient));
	}

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get a list of all (matching) patients")
	@ApiResponse(responseCode = "200", description = "List of patients", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = PatientGeneralDto.class)))})
	@ApiResponse(responseCode = "204", description = "No matching patients found", content = {@Content()})
	@ApiResponse(responseCode = "400", content = {@Content(schema = @Schema(implementation = InvalidParametersErrorDetails.class))})
	public Iterable<PatientGeneralDto> getAll(
		@RequestParam(required = false) String name,
		@RequestParam(required = false) String surname,
		@RequestParam(required = false) @Valid @PESEL String pesel) {
		return patientService.findMatchingBy(name, surname, pesel).stream().map(PatientGeneralDto::fromEntity).toList();
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
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = PatientGeneralDto.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	@ApiResponse(responseCode = "409", content = @Content)
	public PatientGeneralDto update(@RequestBody @Valid UpdatePatient patient) {
		return PatientGeneralDto.fromEntity(patientService.update(patient));
	}

}

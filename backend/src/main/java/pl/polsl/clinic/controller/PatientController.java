package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.component.PatientGeneralModelAssembler;
import pl.polsl.clinic.component.PatientModelAssembler;
import pl.polsl.clinic.dto.*;
import pl.polsl.clinic.dto.requests.AddPatient;
import pl.polsl.clinic.dto.requests.UpdatePatient;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.service.PatientService;

import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping(path = "/api/v1/patients")
public class PatientController {
	private final PatientService patientService;
	private final PatientModelAssembler patientModelAssembler;
	private final PatientGeneralModelAssembler patientGeneralModelAssembler;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Add patient")
	@ApiResponse(responseCode = "201", content = {@Content(schema = @Schema(implementation = PatientGeneralDto.class))})
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	@ApiResponse(responseCode = "409", content = @Content)
	public EntityModel<PatientGeneralDto> add(@RequestBody @Valid AddPatient addPatient) {
		return patientGeneralModelAssembler.toModel(PatientGeneralDto.fromEntity(patientService.add(addPatient)));
	}

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get a list of all patients")
	@ApiResponse(responseCode = "200", description = "List of patients", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = PatientGeneralDto.class)))})
	public Iterable<EntityModel<PatientGeneralDto>> getAll() {
		return patientGeneralModelAssembler.toCollectionModel(patientService.findAll().stream().map(PatientGeneralDto::fromEntity).toList());
	}

	@GetMapping("/search")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Search for matching patients")
	@ApiResponse(responseCode = "200", description = "List of matching patients", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = PatientGeneralDto.class)))})
	@ApiResponse(responseCode = "400", content = {@Content(schema = @Schema(implementation = InvalidParametersErrorDetails.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public Iterable<EntityModel<PatientGeneralDto>> getMatchingBy(@RequestParam(required = false) String name, @RequestParam(required = false) String surname, @RequestParam(required = false) String pesel) {
		return patientGeneralModelAssembler.toCollectionModel(
			StreamSupport.stream(patientService.findMatchingBy(name, surname, pesel).spliterator(), false)
				.map(PatientGeneralDto::fromEntity).toList()
		);
	}

	@GetMapping("{id}")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get patient by id")
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = PatientDto.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public EntityModel<PatientDto> getById(@PathVariable Long id) {
		return patientModelAssembler.toModel(
			PatientDto.fromEntity(patientService.findById(id).orElseThrow(() -> new ItemNotFoundException(PatientDto.class, id)))
		);
	}

	@PutMapping
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Update patient")
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = PatientGeneralDto.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	@ApiResponse(responseCode = "409", content = @Content)
	public EntityModel<PatientGeneralDto> update(@RequestBody @Valid UpdatePatient patient) {
		return patientGeneralModelAssembler.toModel(
			PatientGeneralDto.fromEntity(patientService.update(patient))
		);
	}

}

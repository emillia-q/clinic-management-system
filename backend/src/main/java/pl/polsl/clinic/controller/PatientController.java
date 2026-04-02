package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.ItemNotFoundErrorDetails;
import pl.polsl.clinic.dto.ValidationErrorDetails;
import pl.polsl.clinic.dto.requests.AddPatient;
import pl.polsl.clinic.entity.Patient;
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
	@ApiResponse(responseCode = "201", content = {@Content(schema = @Schema(implementation = Patient.class))})
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	public Patient add(@RequestBody @Valid AddPatient addPatient) {
		return patientService.addPatient(addPatient);
	}

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	@ApiResponse(responseCode = "200", description = "List of patients", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = Patient.class)))})
	public Iterable<Patient> getAll() {
		return patientService.findAll();
	}

	@SneakyThrows
	@GetMapping("{id}")
	@ResponseStatus(HttpStatus.OK)
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = Patient.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public Patient getById(@PathVariable Long id) {
		return patientService.findById(id).orElseThrow(() -> new ItemNotFoundException(Patient.class, id));
	}

	@PutMapping("{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@ApiResponse(responseCode = "204")
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	public void updateById(@PathVariable Long id, @RequestBody @Valid AddPatient patient) {
		patientService.updateById(id, patient);
	}

}

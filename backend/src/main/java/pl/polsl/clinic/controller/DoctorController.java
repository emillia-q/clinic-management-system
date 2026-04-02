package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.DoctorDto;
import pl.polsl.clinic.dto.ItemNotFoundErrorDetails;
import pl.polsl.clinic.dto.ValidationErrorDetails;
import pl.polsl.clinic.dto.requests.AddDoctor;
import pl.polsl.clinic.dto.requests.UpdateDoctor;
import pl.polsl.clinic.entity.Doctor;
import pl.polsl.clinic.exceptions.ItemNotFoundException;
import pl.polsl.clinic.service.DoctorService;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping(path = "/api/v1/doctor")
public class DoctorController {
	private final DoctorService doctorService;

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	@ApiResponse(responseCode = "200", description = "List of doctors", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = DoctorDto.class)))})
	public Iterable<DoctorDto> getAll() {
		return doctorService.findAll().stream().map(DoctorDto::fromEntity).toList();
	}

	@GetMapping("{id}")
	@ResponseStatus(HttpStatus.OK)
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = DoctorDto.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public DoctorDto getById(@PathVariable @NotNull Long id) {
		return DoctorDto.fromEntity(doctorService.findById(id).orElseThrow(() -> new ItemNotFoundException(Doctor.class, id)));
	}

	@GetMapping("license/{license}")
	@ResponseStatus(HttpStatus.OK)
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = DoctorDto.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public DoctorDto getByLicense(@PathVariable @NotNull @NotEmpty String license) {
		return DoctorDto.fromEntity(doctorService.findByLicenseNo(license).orElseThrow(() -> new ItemNotFoundException(Doctor.class, license)));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@ApiResponse(responseCode = "201", content = {@Content(schema = @Schema(implementation = DoctorDto.class))})
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	@ApiResponse(responseCode = "409", content = @Content)
	public DoctorDto add(@RequestBody @NotNull @Valid AddDoctor doctor) {
		return DoctorDto.fromEntity(doctorService.add(doctor));
	}

	@PutMapping
	@ResponseStatus(HttpStatus.OK)
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = DoctorDto.class))})
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	@ApiResponse(responseCode = "409", content = @Content)
	public DoctorDto update(@RequestBody @NotNull @Valid UpdateDoctor doctor) {
		return DoctorDto.fromEntity(doctorService.update(doctor));
	}
}

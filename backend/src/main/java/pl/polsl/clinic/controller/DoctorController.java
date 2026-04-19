package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.*;
import pl.polsl.clinic.entity.Doctor;
import pl.polsl.clinic.entity.Patient;
import pl.polsl.clinic.entity.Visit;
import pl.polsl.clinic.enums.VisitStatus;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.service.PatientService;
import pl.polsl.clinic.service.StaffService;
import pl.polsl.clinic.service.VisitService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping(path = "/api/v1/doctors")
public class DoctorController {
	private final PatientService patientService;
	private final StaffService staffService;
	private final VisitService visitService;


	//<editor-fold desc="Get doctor(s)">
	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get a list of all doctors")
	@ApiResponse(responseCode = "200", description = "List of doctors", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = DoctorGeneralDto.class)))})
	public Iterable<DoctorGeneralDto> getAll() {
		return StreamSupport.stream(staffService.findAllDoctors().spliterator(), false)
			.map(DoctorGeneralDto::mapFromEntity).toList();
	}

	@GetMapping("{id}")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get doctor by id")
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = DoctorDto.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public DoctorDto getById(@PathVariable Long id) {
		return DoctorDto.mapFromEntity(
			staffService.findDoctorById(id).orElseThrow(() -> new ItemNotFoundException(Doctor.class, id))
		);
	}
	//</editor-fold>


	//<editor-fold desc="Get patient(s) info">
	@GetMapping("patients")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get a list of all patients")
	@ApiResponse(responseCode = "200", description = "List of patients", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = PatientGeneralDto.class)))})
	public Iterable<PatientGeneralDto> Patients() {
		return patientService.findAll().stream().map(PatientGeneralDto::fromEntity).toList();
	}

	@Data
	public static class PatientWithUpcomingVisitDateDto {
		private final PatientDto patient;
		private final LocalDateTime upcomingVisit;
	}

	@GetMapping("patients/{patientId}")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get patient with upcoming visit by id")
	@ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = PatientWithUpcomingVisitDateDto.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public PatientWithUpcomingVisitDateDto PatientInfo(Long patientId) {
		var params = new VisitService.VisitParams(null, patientId, LocalDate.now(), null, VisitStatus.Registered, 1);

		return new PatientWithUpcomingVisitDateDto(
			PatientDto.fromEntity(
				patientService.findById(patientId).orElseThrow(() -> new ItemNotFoundException(Patient.class, patientId))
			),
			StreamSupport.stream(visitService.getMatchingVisits(params).spliterator(), false).findFirst()
				.map(Visit::getAppointmentDate).orElse(null)
		);
	}

	@Data
	public class PatientHistoryDto {
		Iterable<VisitExamDateTypeDto> visits;
		Iterable<VisitExamDateTypeDto> physicalExams;
		Iterable<VisitExamDateTypeDto> labExams;
	}

	@GetMapping("patients/{patientId}/history")
	@Operation(summary = "WIP (not implemented)")
	@Tag(name = "WIP Doctor-Visits")
	public PatientHistoryDto ViewPatientVisitHistory(Long patientId) {
		throw new NotImplementedException("ViewPatientVisitHistory is not implemented yet.");
		//get patient visit history, physical exams, lab exams
		//sorted in desc order
//		var params= new VisitService.VisitParams(patientId, Sort.Direction.DESC)
//		return new PatientHistoryDto(
//			StreamSupport.stream(visitService.getMatchingVisits(params).spliterator(),false).map(VisitExamDateTypeDto::fromEntity),
//		);
	}

	@Data
	public class ScheduleExamRequest {
		@NonNull
		@NotEmpty
		private String ExamType;
		@NonNull
		@NotEmpty
		private String ExamName;
		private String Notes;
		//fill in from context
		private Long patientId;
		private Long doctorId;
		private Long visitId;
	}
	//</editor-fold>

	@PostMapping("patients/{patientId}/exam")
	public void Exam(
		@PathVariable Long patientId,
		@RequestBody @NonNull @Valid ScheduleExamRequest request
	) {
		//add a new exam(ExamType(L|P)) to patient with id
	}


	@GetMapping("visits")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get a list of visits(appointments) that match the parameters. Ordered by appointment date ascending.")
	@ApiResponse(responseCode = "200", description = "List of matching visits", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = VisitGeneralDto.class)))})
	public Iterable<VisitGeneralDto> Visits(
		@RequestParam(required = false) Long doctorId,
		@RequestParam(required = false) Long patientId,
		@RequestParam(required = false) LocalDate fromDate, //on date (fromDate===toDate)
		@RequestParam(required = false) LocalDate toDate,
		@RequestParam(required = false) VisitStatus status) {
		return StreamSupport.stream(visitService.getMatchingVisits(
				new VisitService.VisitParams(doctorId, patientId, fromDate, toDate, status)
			).spliterator(), false)
			.map(VisitGeneralDto::fromEntity).toList();
	}

	@PatchMapping("visits/{visitId}/start")
	@Operation(summary = "WIP (not implemented)")
	@Tag(name = "WIP Visits")
	public void StartVisit(Long visitId) {
		//
	}

	@PatchMapping("visits/{visitId}/cancel")
	@Operation(summary = "WIP (not implemented)")
	@Tag(name = "WIP Visits")
	public void CancelVisit(Long visitId) {
		//
	}

	@PatchMapping("visits/{visitId}/finish")
	@Operation(summary = "WIP (not implemented)")
	@Tag(name = "WIP Doctor-Visits")
	public void FinishVisit(Long visitId) {
		//adds Diagnosis and Description to finish a visit
	}


}

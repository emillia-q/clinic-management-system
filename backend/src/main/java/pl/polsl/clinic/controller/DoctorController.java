package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.*;
import pl.polsl.clinic.dto.requests.AddLabExamRequest;
import pl.polsl.clinic.dto.requests.AddPhysicalExamRequest;
import pl.polsl.clinic.entity.Doctor;
import pl.polsl.clinic.entity.Patient;
import pl.polsl.clinic.entity.Visit;
import pl.polsl.clinic.enums.VisitStatus;
import pl.polsl.clinic.exception.ItemNotFoundException;
import pl.polsl.clinic.service.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping(path = "/api/v1/doctors")
public class DoctorController {
	private final PatientService patientService;
	private final StaffService staffService;
	private final VisitService visitService;
	private final PhysicalExamService physicalExamService;
	private final LabService labService;


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
	@AllArgsConstructor
	public static class PatientHistoryDto {
		Iterable<VisitExamDateTypeDto> visits;
		Iterable<VisitExamDateTypeDto> physicalExams;
		Iterable<VisitExamDateTypeDto> labExams;
	}

	@GetMapping("patients/{patientId}/history")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get patient visit history, physical exams, lab exams (sorted in desc order)")
	@ApiResponse(responseCode = "204", description = "Patient does not have any visit history")
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public ResponseEntity<PatientHistoryDto> ViewPatientVisitHistory(Long patientId) {
		var params = new VisitService.VisitParams(null, patientId, Sort.Direction.DESC);
		var resultingVisitsList = StreamSupport.stream(visitService.getMatchingVisits(params).spliterator(), false).toList();
		if (resultingVisitsList.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		//at this point all the data is present(including patient's exams histories)
		// but is in format [Visit{LabExams[...], PhysicalExams[...], ...}]
		// we want {[Visits], [LabExams], [PhysicalExams]}
		// so we flatten it and remap
		return new ResponseEntity<>(new PatientHistoryDto(
			resultingVisitsList.stream().map(VisitExamDateTypeDto::fromEntity).toList(),
			resultingVisitsList.stream()
				.flatMap(visit -> visit.getPhysicalExams().stream()) // Flattens List<List<P>> to Stream<P>
				.map(VisitExamDateTypeDto::fromEntity)
				.sorted(Comparator.comparing(VisitExamDateTypeDto::getDate).reversed()) // desc order
				.toList(),
			resultingVisitsList.stream()
				.flatMap(visit -> visit.getLabExams().stream()) // Flattens List<List<L>> to Stream<L>
				.map(VisitExamDateTypeDto::fromEntity)
				.sorted(Comparator.comparing(VisitExamDateTypeDto::getDate).reversed()) // desc order
				.toList()
		), HttpStatus.OK);
	}
	//</editor-fold>


	//<editor-fold desc="Add exam(request) to patient">
	@PostMapping("lab-exam")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Add laboratory exam request on this visit")
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public void LabExam(
		@RequestBody @NonNull @Valid AddLabExamRequest request
	) {
		labService.add(request);
	}

	@PostMapping("physical-exam")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Add the performed physical exam results on this visit")
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public void PhysicalExam(
		@RequestBody @NonNull @Valid AddPhysicalExamRequest request
	) {
		physicalExamService.add(request);
	}
	//</editor-fold>


	//<editor-fold desc="Get Visits">
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

	@GetMapping("my-visits")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Get a list of today's visits to handle. Ordered by appointment date ascending.")
	@ApiResponse(responseCode = "200", description = "List of today's visits", content = {@Content(array = @ArraySchema(schema = @Schema(implementation = VisitGeneralDto.class)))})
	public Iterable<VisitGeneralDto> MyVisits(
		///TODO: auto fetch this from Auth header later
		@RequestParam(required = false) Long doctorId) {
		return StreamSupport.stream(visitService.getMatchingVisits(
				new VisitService.VisitParams(doctorId, null, LocalDate.now())
			).spliterator(), false)
			.map(VisitGeneralDto::fromEntity).toList();
	}
	//</editor-fold>


	//<editor-fold desc="Modify visit status with details">
	@PatchMapping("visits/start")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Start a visit")
	@ApiResponse(responseCode = "400", content = {@Content(schema = @Schema(implementation = InvalidParametersErrorDetails.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public void StartVisit(@NonNull @Valid VisitService.ModifyVisitDoctorRequest request) {
		visitService.ModifyVisitDoctor(request, VisitStatus.In_Progress);
	}

	@PatchMapping("visits/cancel")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Cancel a visit due to reasons")
	@ApiResponse(responseCode = "400", content = {@Content(schema = @Schema(implementation = InvalidParametersErrorDetails.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public void CancelVisit(@NonNull @Valid VisitService.ModifyVisitDoctorRequest request) {
		visitService.ModifyVisitDoctor(request, VisitStatus.Cancelled);
	}

	@PatchMapping("visits/finish")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Finish a visit")
	@ApiResponse(responseCode = "400", content = {@Content(schema = @Schema(implementation = InvalidParametersErrorDetails.class))})
	@ApiResponse(responseCode = "404", content = {@Content(schema = @Schema(implementation = ItemNotFoundErrorDetails.class))})
	public void FinishVisit(@NonNull @Valid VisitService.ModifyVisitDoctorRequest request) {
		visitService.ModifyVisitDoctor(request, VisitStatus.Finished);
	}
	//</editor-fold>


}

package pl.polsl.clinic.controller;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.PatientDto;
import pl.polsl.clinic.service.PatientService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping(path = "/api/v1/doctors")
public class DoctorController {
	private final PatientService patientService;

	@GetMapping("visits")
	public void Visits(
		@RequestParam(required = false) Long doctor,
		@RequestParam(required = false) LocalDate date,
		@RequestParam(required = false) String status) {
		//get the visits(appointments)
		//  assigned to doctor
		//  on date (accepts "today")
		//  with status
		//sorted in asc order
		//returns a list of Visit (and count of visits in given day)?
	}

	@GetMapping("patients")
	public void Patients() {
		//get all patients
	}

	@Data
	public class PatientWithUpcomingVisitsDto {
//		private final PatientDto patientDto;
//		private final List<VisitGeneralDto> upcomingVisits; //max 5
	}

	@Data
	public class VisitGeneralDto { //who, when, where
	}

	@GetMapping("patients/{patientId}")
	public PatientWithUpcomingVisitsDto PatientInfo(Long patientId) {
		//get patient info by id

		//patientService.findById(patientId);
		// show upcoming visits
		return new PatientWithUpcomingVisitsDto();
	}

	@Data
	public class PatientHistoryDto {
		// visit history, physical exams, lab exams
	}

	@GetMapping("patients/{patientId}/history")
	public PatientHistoryDto ViewPatientVisitHistory(Long patientId) {
		//get patient visit history, physical exams, lab exams
		//sorted in desc order
		return new PatientHistoryDto();
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

	@PostMapping("patients/{patientId}/exam")
	public void Exam(
		@PathVariable Long patientId,
		@RequestBody ScheduleExamRequest request
	) {
		//add a new exam(ExamType(L|P)) to patient with id
	}

	//public void Visits(Long id)

	@PatchMapping("visits/{visitId}/start")
	public void StartVisit(Long visitId) {
		//
	}

	@PatchMapping("visits/{visitId}/cancel")
	public void CancelVisit(Long visitId) {
		//
	}

	@PatchMapping("visits/{visitId}/finish")
	public void FinishVisit(Long visitId) {
		//adds Diagnosis and Description to finish a visit
	}


}

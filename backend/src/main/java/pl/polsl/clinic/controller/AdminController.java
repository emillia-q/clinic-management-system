package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.polsl.clinic.dto.StaffCreatedDto;
import pl.polsl.clinic.dto.ValidationErrorDetails;
import pl.polsl.clinic.dto.requests.AddStaff;
import pl.polsl.clinic.entity.Staff;
import pl.polsl.clinic.service.AdminService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {
	private final AdminService adminService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Add new staff member")
	@ApiResponse(responseCode = "201", description = "Staff created")
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	public StaffCreatedDto add(@RequestBody @Valid AddStaff addStaff){
		return StaffCreatedDto.fromEntity(adminService.addStaffMember(addStaff));
	}
}

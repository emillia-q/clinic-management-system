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
import pl.polsl.clinic.dto.StaffDto;
import pl.polsl.clinic.dto.StaffListDto;
import pl.polsl.clinic.dto.ValidationErrorDetails;
import pl.polsl.clinic.dto.requests.AddStaff;
import pl.polsl.clinic.enums.UserType;
import pl.polsl.clinic.service.AdminService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/staff")
public class StaffController {
	private final AdminService adminService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Add new staff member")
	@ApiResponse(responseCode = "201", description = "Staff created")
	@ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(schema = @Schema(implementation = ValidationErrorDetails.class)))
	public StaffCreatedDto add(@RequestBody @Valid AddStaff addStaff) {
		return StaffCreatedDto.fromEntity(adminService.addStaffMember(addStaff));
	}

	@GetMapping
	@Operation(summary = "Get staff list for tabs with optional search")
	public List<StaffListDto> getList(
		@RequestParam(required = false) UserType type,
		@RequestParam(required = false, defaultValue = "") String query) {
		return adminService.getStaffList(type, query);
	}

	@PatchMapping("/{id}/active")
	@Operation(summary = "Toggle staff active status (Enable/Disable account)")
	@ApiResponse(responseCode = "200", description = "Status updated")
	@ApiResponse(responseCode = "404", description = "Staff member not found")
	public void toggleActive(@PathVariable Long id) {
		adminService.toggleStaffActive(id);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Get full details of a specific staff member")
	public StaffDto getDetails(@PathVariable Long id) {
		return StaffDto.fromEntity(adminService.getStaffById(id));
	}
}

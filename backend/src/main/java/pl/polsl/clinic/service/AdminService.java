package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.StaffListDto;
import pl.polsl.clinic.dto.requests.AddStaff;
import pl.polsl.clinic.entity.*;
import pl.polsl.clinic.enums.UserType;
import pl.polsl.clinic.repository.*;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
	private final StaffRepository staffRepository;
	private final DoctorRepository doctorRepository;
	private final ReceptionistRepository receptionistRepository;
	private final LabTechnicianRepository labTechnicianRepository;
	private final LabManagerRepository labManagerRepository;

	private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

	private String generateUniqueLogin(String base) {
		String candidate = base;
		int counter = 1;
		while (staffRepository.existsByLogin(candidate)) {
			candidate = base + counter;
			counter++;
		}
		return candidate;
	}

	@Transactional
	public Staff addStaffMember(AddStaff dto) {
		// Auto generated login: firstName_lastName
		String baseLogin = (dto.getFirstName() + "_" + dto.getLastName()).toLowerCase();
		String finalLogin = generateUniqueLogin(baseLogin);

		// Random password
		String tempPasswd = java.util.UUID.randomUUID().toString().substring(0, 8);
		Staff staff;

		// Create an object based on type from dto
		switch (dto.getUserType()) {
			case Doctor -> {
				Doctor doctor = new Doctor();
				doctor.setLicenseNo(dto.getLicenseNo());
				staff = doctor;
			}
			case Receptionist -> staff = new Receptionist();
			case LabTechnician -> staff = new LabTechnician();
			case LabManager -> staff = new LabManager();
			default -> staff = new Staff(); // Admin
		}

		// Map sharing data
		staff.setFirstName(dto.getFirstName());
		staff.setLastName(dto.getLastName());
		staff.setLogin(finalLogin);

		// Make hashed password
		String hashedPasswd=passwordEncoder.encode(tempPasswd);
		staff.setPassword(hashedPasswd);

		staff.setUserType(dto.getUserType());
		staff.setIsActive("Y");
		staff.setPasswdChangeRequired("Y");

		return staffRepository.save(staff);
	}

	public List<StaffListDto> getStaffList(UserType type, String query) {
		// for LIKE to work properly when teh query is null
		String searchPhrase = (query == null) ? "" : query;

		return staffRepository.findByRoleAndQuery(type, searchPhrase)
			.stream()
			.map(StaffListDto::fromEntity)
			.toList();
	}

	@Transactional
	public void toggleStaffActive(Long id) {
		Staff staff = staffRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("Staff member not found with id: " + id));

		// Toggle
		String newStatus = "Y".equals(staff.getIsActive()) ? "N" : "Y";
		staff.setIsActive(newStatus);
	}

	public Staff getStaffById(Long id) {
		return staffRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("Staff member not found with id: " + id));
	}
}

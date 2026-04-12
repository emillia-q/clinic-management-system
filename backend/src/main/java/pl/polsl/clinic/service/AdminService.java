package pl.polsl.clinic.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.requests.AddStaff;
import pl.polsl.clinic.entity.*;
import pl.polsl.clinic.repository.*;

@Service
@RequiredArgsConstructor
public class AdminService {
	private final StaffRepository staffRepository;
	private final DoctorRepository doctorRepository;
	private final ReceptionistRepository receptionistRepository;
	private final LabTechnicianRepository labTechnicianRepository;
	private final LabManagerRepository labManagerRepository;

	private String generateUniqueLogin(String base){
		String candidate= base;
		int counter=1;
		while(staffRepository.existsByLogin(candidate)){
			candidate=base+counter;
			counter++;
		}
		return candidate;
	}

	@Transactional
	public Staff addStaffMember(AddStaff dto){
		// Auto generated login: firstName_lastName
		String baseLogin = (dto.getFirstName()+"_"+dto.getLastName()).toLowerCase();
		String finalLogin=generateUniqueLogin(baseLogin);

		// Random password
		String tempPasswd=java.util.UUID.randomUUID().toString().substring(0,8);
		Staff staff;

		// Create an object based on type from dto
		switch(dto.getUserType()){
			case Doctor -> {
				Doctor doctor = new Doctor();
				doctor.setLicenseNo(dto.getLicenseNo());
				staff=doctor;
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
		staff.setPassword(tempPasswd);
		staff.setUserType(dto.getUserType());
		staff.setIsActive("Y");
		staff.setPasswdChangeRequired("Y");

		return staffRepository.save(staff);
	}
}

package pl.polsl.clinic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.auth.ChangePasswordRequest;
import pl.polsl.clinic.dto.auth.LoginRequest;
import pl.polsl.clinic.dto.auth.LoginResponse;
import pl.polsl.clinic.entity.Staff;
import pl.polsl.clinic.exception.InvalidParametersException;
import pl.polsl.clinic.repository.StaffRepository;
import pl.polsl.clinic.security.jwt.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {
	private final AuthenticationManager authenticationManager;
	private final StaffUserDetailsService userDetailsService;
	private final JwtService jwtService;
	private final StaffRepository staffRepository;
	private final PasswordEncoder passwordEncoder;

	public LoginResponse authenticate(LoginRequest request){
		authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(
				request.login(),
				request.password()
			)
		);

		UserDetails userDetails = userDetailsService.loadUserByUsername(request.login());
		Staff staff = staffRepository.findByLogin(request.login()).orElseThrow();
		String token = jwtService.generateToken(userDetails, staff.getUserId());
		boolean changeRequired = "Y".equals(staff.getPasswdChangeRequired());

		return new LoginResponse(
			token,
			staff.getLogin(),
			staff.getUserType(),
			staff.getUserId(),
			changeRequired
		);
	}

	public void changePassword(String login, ChangePasswordRequest request) {
		if (!request.newPassword().equals(request.confirmPassword())) {
			throw new InvalidParametersException("Passwords do not match");
		}

		Staff staff = staffRepository.findByLogin(login).orElseThrow();
		staff.setPassword(passwordEncoder.encode(request.newPassword()));
		staff.setPasswdChangeRequired("N");
		staffRepository.save(staff);
	}
}

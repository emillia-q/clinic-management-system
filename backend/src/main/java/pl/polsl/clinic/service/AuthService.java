package pl.polsl.clinic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.dto.auth.LoginRequest;
import pl.polsl.clinic.dto.auth.LoginResponse;
import pl.polsl.clinic.entity.Staff;
import pl.polsl.clinic.repository.StaffRepository;
import pl.polsl.clinic.security.jwt.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {
	private final AuthenticationManager authenticationManager;
	private final StaffUserDetailsService userDetailsService;
	private final JwtService jwtService;
	private final StaffRepository staffRepository;

	public LoginResponse authenticate(LoginRequest request){
		// Login & password verification
		authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(
				request.login(),
				request.password()
			)
		);

		// Retrieving user data from the database (to generate token)
		UserDetails userDetails=userDetailsService.loadUserByUsername(request.login());

		// Fetching the full Staff entity (to extract the React response role)
		Staff staff = staffRepository.findByLogin(request.login()).orElseThrow();

		// Generate token
		String token = jwtService.generateToken(userDetails, staff.getUserId());

		return new LoginResponse(
			token,
			staff.getLogin(),
			staff.getUserType(),
			staff.getUserId()
		);
	}
}

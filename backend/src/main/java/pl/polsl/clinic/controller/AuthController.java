package pl.polsl.clinic.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.polsl.clinic.dto.auth.LoginRequest;
import pl.polsl.clinic.dto.auth.LoginResponse;
import pl.polsl.clinic.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	@PostMapping("/login")
	@SecurityRequirements
	public LoginResponse login(@RequestBody @Valid LoginRequest request){
		return authService.authenticate(request);
	}
}

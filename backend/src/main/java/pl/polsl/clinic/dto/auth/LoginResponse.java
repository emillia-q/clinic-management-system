package pl.polsl.clinic.dto.auth;

import pl.polsl.clinic.enums.UserType;

public record LoginResponse(
	String token,
	String login,
	UserType role,
	String type
) {
	public LoginResponse(String token,String login, UserType role){
		this(token,login,role,"Bearer");
	}
}

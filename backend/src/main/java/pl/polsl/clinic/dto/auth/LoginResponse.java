package pl.polsl.clinic.dto.auth;

import pl.polsl.clinic.enums.UserType;

public record LoginResponse(
	String token,
	String login,
	UserType role,
	Long userId,
	String type
) {
	public LoginResponse(String token,String login, UserType role, Long userId){
		this(token,login,role,userId,"Bearer");
	}
}

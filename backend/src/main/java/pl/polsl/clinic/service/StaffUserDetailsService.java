package pl.polsl.clinic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.polsl.clinic.entity.Staff;
import pl.polsl.clinic.repository.StaffRepository;

@Service
@RequiredArgsConstructor
public class StaffUserDetailsService implements UserDetailsService {
	private final StaffRepository staffRepository;

	@Override
	public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
		Staff staff = staffRepository.findByLogin(login).orElseThrow(() -> new UsernameNotFoundException("User not found"));

		if (!"Y".equals(staff.getIsActive()))
			throw new DisabledException("Account is disabled");

		return User.builder()
			.username(staff.getLogin())
			.password(staff.getPassword())
			.roles(staff.getUserType().name())
			.build();
	}
}

package pl.polsl.clinic.security.jwt;

import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(
		@Nonnull HttpServletRequest request,
		@Nonnull HttpServletResponse response,
		@Nonnull FilterChain filterChain
	) throws ServletException, IOException {
		final var jwtOptional = jwtService.getTokenFromRequest(request);

		if (jwtOptional.isEmpty()) {
			filterChain.doFilter(request, response);
			return;
		}

		String jwt = jwtOptional.get();
		String userLogin = jwtService.extractUsername(jwt);

		if (userLogin != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails = this.userDetailsService.loadUserByUsername(userLogin);

			if (jwtService.isTokenValid(jwt, userDetails)) {

				List<Map<String, String>> roles = jwtService.extractClaim(jwt, claims -> claims.get("role", List.class));

				List<SimpleGrantedAuthority> authorities;
				if (roles != null) {
					authorities = roles.stream()
						.map(roleMap -> new SimpleGrantedAuthority(roleMap.get("authority")))
						.toList();
				} else {

					authorities = userDetails.getAuthorities().stream()
						.map(a -> new SimpleGrantedAuthority(a.getAuthority()))
						.toList();
				}

				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
					userDetails,
					null,
					authorities
				);

				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authToken);
			}
		}
		filterChain.doFilter(request, response);
	}
}
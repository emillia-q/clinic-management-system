package pl.polsl.clinic.security.jwt;

import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

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
		) throws ServletException, IOException{
		final var jwt = jwtService.getTokenFromRequest(request);
		final String userLogin;

		// If there is no Bearer header, go to the next filter
		if(jwt.isEmpty()){
			filterChain.doFilter(request,response);
			return;
		}
		userLogin=jwtService.extractUsername(jwt.get());

		// If we have a login and the user is not yet "logged in" to the system
		if(userLogin!=null&& SecurityContextHolder.getContext().getAuthentication()==null){
			UserDetails userDetails=this.userDetailsService.loadUserByUsername(userLogin);

			// Check if token didn't expire
			if(jwtService.isTokenValid(jwt.get(),userDetails)){
				UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(
					userDetails,
					null,
					userDetails.getAuthorities()
				);
				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				// WE OFFICIALLY LOG THE USER INTO THE SYSTEM for the duration of this one query
				SecurityContextHolder.getContext().setAuthentication(authToken);
			}
		}
		filterChain.doFilter(request, response);
	}
}

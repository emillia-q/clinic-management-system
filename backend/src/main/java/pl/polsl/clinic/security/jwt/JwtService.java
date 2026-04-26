package pl.polsl.clinic.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
	private final SecretKey signingKey;
	private final long expirationSeconds;

	private <T> T extractClaim(String token, Function<Claims, T> resolver) {
		Claims claims = Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload();
		return resolver.apply(claims);
	}

	private boolean isTokenExpired(String token) {
		return extractClaim(token, Claims::getExpiration).before(new Date());
	}

	public JwtService(
		@Value("${app.jwt.secret}") String secret,
		@Value("${app.jwt.expiration-seconds:36000}") long expirationSeconds
	) {
		this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.expirationSeconds = expirationSeconds;
	}

	public String generateToken(UserDetails userDetails, Long userId) {
		Map<String, Object> claims = new HashMap<>();
		// Add role to token so front knows who the user is
		claims.put("role", userDetails.getAuthorities());
		claims.put("userId", userId);
		Instant now = Instant.now();
		Instant expiresAt = now.plusSeconds(expirationSeconds);

		return Jwts.builder()
			.claims(claims)
			.subject(userDetails.getUsername())
			.issuedAt(Date.from(now))
			.expiration(Date.from(expiresAt))
			.signWith(signingKey)
			.compact();
	}

	// Extract login from token
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
		String username = extractUsername(token);
		return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
	}

	public Long extractUserId(String token) {
		Object userIdClaim = extractClaim(token, claims -> claims.get("userId"));
		if (userIdClaim instanceof Number number) {
			return number.longValue();
		}
		return null;
	}
}

package reidConnect.backend.config;

import reidConnect.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtService jwtService;

    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService,
            HandlerExceptionResolver handlerExceptionResolver
    ){
        this.jwtService=jwtService;
        this.userDetailsService=userDetailsService;
        this.handlerExceptionResolver=handlerExceptionResolver;
    }
    @Override
    protected void doFilterInternal(

            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    )throws ServletException, IOException {
        final String authheader=request.getHeader("Authorization");

        if(authheader==null || !authheader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }
        try {
            final String jwt=authheader.substring(7);
            final String userEmail=jwtService.extractUsername(jwt);

            System.out.println("📨 Extracted email from JWT: " + userEmail);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (userEmail != null && authentication == null){
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                System.out.println("🧍 Loaded UserDetails username: " + userDetails.getUsername());

                boolean tokenExpired = jwtService.isTokenExpired(jwt);
                System.out.println("📆 Token expired? " + tokenExpired);
                System.out.println("✅ Username matches token? " + userEmail.equals(userDetails.getUsername()));

                if(jwtService.isTokenValid(jwt,userDetails)){
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ Authenticated user: " + userDetails.getUsername() + " | Authorities: " + userDetails.getAuthorities());
                } else {
                    System.out.println("❌ JWT Token is not valid for user.");
                }
            }
            filterChain.doFilter(request,response);
        } catch (Exception exception){
            handlerExceptionResolver.resolveException(request,response,null,exception);
        }
    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Only bypass filter for auth endpoints and public resources
        String path = request.getServletPath();
        return path.startsWith("/auth/") || 
               path.startsWith("/test") || 
               path.startsWith("/uploads/");
    }
}

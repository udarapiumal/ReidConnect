package reidConnect.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
        private final AuthenticationProvider authenticationProvider;

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        @Value("${app.cors.allowed-origins:http://localhost:3000}")
        private String allowedOrigins;

        public SecurityConfiguration(AuthenticationProvider authenticationProvider,
                        JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.authenticationProvider = authenticationProvider;
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors
                                                .configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(authorize -> authorize
                                                .requestMatchers("/auth/**", "/test", "/uploads/**").permitAll()
                                                .requestMatchers("/api/timetable/byDay/**").permitAll()
                                                // Allow WebSocket handshake + SockJS info/endpoints
                                                .requestMatchers("/ws-notifications/**").permitAll()
                                                // Allow CORS preflight requests globally
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers("/api/posts/uploads/**").permitAll() // Allow direct
                                                                                                      // access to
                                                                                                      // uploaded images
                                                .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll() // Allow
                                                                                                               // public
                                                                                                               // access
                                                                                                               // to GET
                                                                                                               // events
                                                .requestMatchers("/api/subscriptions/**").authenticated()
                                                .requestMatchers("/api/posts/**").authenticated()
                                                .requestMatchers("/api/academic-calendar/**").permitAll()
                                                .requestMatchers("/api/timetable/**").authenticated()
                                                .requestMatchers("/api/courses/**").authenticated()
                                                .requestMatchers("/api/events/**").authenticated() // Other event
                                                                                                   // operations still
                                                                                                   // require auth
                                                .requestMatchers("/api/staff/**").authenticated()
                                                .requestMatchers("/api/student/**").authenticated()
                                                .requestMatchers("/api/venues/**").authenticated()
                                                .requestMatchers("/api/comments/**").authenticated()
                                                .requestMatchers("/lost/**").authenticated()
                                                .requestMatchers("/users/**").authenticated()
                                                .requestMatchers("/bookings/**").authenticated()
                                                .requestMatchers("/api/docusign/**").authenticated()
                                                .requestMatchers("/api/bookings/**").authenticated()
                                                .requestMatchers("/api/timetable-approvals/**").authenticated()
                                                .requestMatchers("/api/posts/club/**").authenticated()
                                                .requestMatchers("/api/club-coordinators/**").authenticated()
                                                .requestMatchers("/api/posts/**").authenticated()
                                                .requestMatchers(HttpMethod.POST, "/student/me/profile-picture")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/student/me/profile-picture")
                                                .authenticated()
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                List<String> origins = Arrays.asList(allowedOrigins.split(","));
                configuration.setAllowedOrigins(origins);
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}

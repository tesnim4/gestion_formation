package com.example.gestion_formation.config;

import com.example.gestion_formation.security.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .userDetailsService(userDetailsService)
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            
            .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**"))
            
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/css/**", "/js/**", "/images/**", "/login", "/error").permitAll()

                .requestMatchers(HttpMethod.GET, "/themes", "/themes/**")
                    .hasAnyRole("ADMIN", "FORMATEUR")   
                .requestMatchers("/themes/**").hasRole("ADMIN") 

                .requestMatchers(HttpMethod.GET, "/apprenants", "/apprenants/**")
                    .hasAnyRole("ADMIN", "FORMATEUR")
                .requestMatchers("/apprenants/**").hasRole("ADMIN") 

                .requestMatchers(HttpMethod.GET, "/sessions", "/sessions/**")
                    .hasAnyRole("ADMIN", "FORMATEUR", "APPRENANT")
                .requestMatchers("/sessions/**").hasAnyRole("ADMIN", "FORMATEUR") 

                .requestMatchers(HttpMethod.GET, "/inscriptions", "/inscriptions/**")
                    .hasAnyRole("ADMIN", "FORMATEUR", "APPRENANT")
                .requestMatchers("/inscriptions/**").hasAnyRole("ADMIN", "FORMATEUR")
                .requestMatchers("/formateurs/**").hasRole("ADMIN")

                .requestMatchers("/recherche/**").authenticated()

                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/", true)
                .failureUrl("/login?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .exceptionHandling(ex -> ex.accessDeniedPage("/access-denied"));

        return http.build();
    }
}
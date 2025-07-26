package com.RentCart.AuthService.Config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class AuthConfig {

    private static final Logger logger = LoggerFactory.getLogger(AuthConfig.class);

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring SecurityFilterChain...");

        http
            .authorizeHttpRequests(auth -> {
                logger.debug("Setting authorization rules: /auth/** -> permitAll, others -> authenticated");
                auth.requestMatchers("/auth/**").permitAll()
                    .anyRequest().authenticated();
            })
            .csrf(csrf -> {
                logger.debug("Disabling CSRF protection");
                csrf.disable();
            })
            .sessionManagement(session -> {
                logger.debug("Configuring session management to STATELESS");
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
            })
            .httpBasic(Customizer.withDefaults());

        logger.info("SecurityFilterChain configured successfully.");
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        logger.info("Creating BCryptPasswordEncoder bean.");
        return new BCryptPasswordEncoder();
    }
}

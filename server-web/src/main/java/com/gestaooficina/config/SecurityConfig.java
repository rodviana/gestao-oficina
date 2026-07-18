package com.gestaooficina.config;

import com.gestaooficina.controller.GestaoOficinaWebControllerMapping;
import com.gestaooficina.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST,
                        GestaoOficinaWebControllerMapping.WEB_AUTH_PATH + GestaoOficinaWebControllerMapping.AUTH_LOGIN)
                .permitAll()
                .antMatchers(HttpMethod.GET, GestaoOficinaWebControllerMapping.WEB_TRACKING_PATH).permitAll()
                .antMatchers(GestaoOficinaWebControllerMapping.HEALTH_PATH).permitAll()
                .antMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**"
                ).permitAll()
                .antMatchers(GestaoOficinaWebControllerMapping.WEB_ME_PATH + "/**").authenticated()
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.request.LoginRequest;
import com.gestaooficina.model.response.LoginResponse;
import com.gestaooficina.model.record.UserRecord;
import com.gestaooficina.repository.AuthRepository;
import com.gestaooficina.security.JwtService;
import com.gestaooficina.utils.UserValidationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private static final Logger log = LoggerFactory.getLogger(LoginService.class);

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginService(AuthRepository authRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        UserValidationUtils.validateLoginRequest(request);

        String email = request.getEmail().trim();
        log.info("[login] attempt email={}", email);

        UserRecord user = authRepository.findByEmail(email)
                .orElseThrow(() -> new GestaoOficinaGenericException("E-mail ou senha inválidos."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("[login] invalid password email={}", user.getEmail());
            throw new GestaoOficinaGenericException("E-mail ou senha inválidos.");
        }

        String token = jwtService.generate(user.getId(), user.getEmail(), user.getName(), user.getRole());
        log.info("[login] OK email={}", user.getEmail());
        return new LoginResponse(token, user.getName(), user.getEmail(), user.getRole());
    }
}

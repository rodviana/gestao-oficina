package com.gestaooficina.service;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.request.LoginRequest;
import com.gestaooficina.model.response.LoginResponse;
import com.gestaooficina.repository.AuthJdbcRepository;
import com.gestaooficina.repository.filter.UserEmailFilter;
import com.gestaooficina.model.record.UserRecord;
import com.gestaooficina.security.JwtService;
import com.gestaooficina.utils.UserValidationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private static final Logger log = LoggerFactory.getLogger(LoginService.class);

    private final AuthJdbcRepository authJdbcRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginService(AuthJdbcRepository authJdbcRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService) {
        this.authJdbcRepository = authJdbcRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        UserValidationUtils.validateLoginRequest(request);

        String email = request.getEmail().trim();
        log.info("[login] attempt email={}", email);

        UserRecord user = authJdbcRepository.findByEmail(new UserEmailFilter(email))
                .orElseThrow(() -> GlobalException.of(ValidationMessageEnum.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("[login] invalid password email={}", user.getEmail());
            throw GlobalException.of(ValidationMessageEnum.INVALID_CREDENTIALS);
        }

        String token = jwtService.generate(user);
        log.info("[login] OK email={}", user.getEmail());
        return new LoginResponse(token, user.getName(), user.getEmail(), user.getRole().getCode());
    }
}

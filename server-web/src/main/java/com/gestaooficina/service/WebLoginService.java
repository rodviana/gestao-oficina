package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.WebLoginRequest;
import com.gestaooficina.model.dto.WebLoginResponse;
import com.gestaooficina.model.dto.CustomerAccountDto;
import com.gestaooficina.repository.CustomerAuthRepository;
import com.gestaooficina.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class WebLoginService {

    public static final String CUSTOMER_ROLE = "CUSTOMER";

    private static final Logger log = LoggerFactory.getLogger(WebLoginService.class);

    private final CustomerAuthRepository customerAuthRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public WebLoginService(CustomerAuthRepository customerAuthRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.customerAuthRepository = customerAuthRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public WebLoginResponse login(WebLoginRequest request) {
        validate(request);

        String login = request.getLogin().trim();
        log.info("[web-login] attempt login={}", login);

        CustomerAccountDto account = customerAuthRepository.findByLogin(login)
                .orElseThrow(() -> new GestaoOficinaGenericException(
                        "E-mail/telefone ou senha incorretos."));

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            log.warn("[web-login] invalid password customerId={}", account.getCustomerId());
            throw new GestaoOficinaGenericException("E-mail/telefone ou senha incorretos.");
        }

        String token = jwtService.generate(
                account.getCustomerId(),
                account.getEmail(),
                account.getName(),
                CUSTOMER_ROLE);
        log.info("[web-login] OK customerId={}", account.getCustomerId());
        return new WebLoginResponse(
                token,
                account.getCustomerId(),
                account.getName(),
                account.getEmail(),
                account.getPhone());
    }

    private void validate(WebLoginRequest request) {
        if (request == null || isBlank(request.getLogin())) {
            throw new GestaoOficinaGenericException("Informe e-mail ou telefone.");
        }
        if (isBlank(request.getPassword())) {
            throw new GestaoOficinaGenericException("Senha é obrigatória.");
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

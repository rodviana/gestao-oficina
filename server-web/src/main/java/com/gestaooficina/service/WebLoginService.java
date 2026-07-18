package com.gestaooficina.service;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.security.JwtService;
import com.gestaooficina.model.record.CustomerRecord;
import com.gestaooficina.model.request.WebLoginRequest;
import com.gestaooficina.model.response.WebLoginResponse;
import com.gestaooficina.repository.CustomerAuthJdbcRepository;
import com.gestaooficina.repository.filter.CustomerLoginFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class WebLoginService {

    public static final String CUSTOMER_ROLE = "CUSTOMER";

    private static final Logger log = LoggerFactory.getLogger(WebLoginService.class);

    private final CustomerAuthJdbcRepository customerAuthJdbcRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public WebLoginService(CustomerAuthJdbcRepository customerAuthJdbcRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.customerAuthJdbcRepository = customerAuthJdbcRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public WebLoginResponse login(WebLoginRequest request) {
        validate(request);

        String login = request.getLogin().trim();
        log.info("[web-login] attempt login={}", login);

        CustomerRecord customer = customerAuthJdbcRepository.findByLogin(new CustomerLoginFilter(login))
                .orElseThrow(() -> GlobalException.of(ValidationMessageEnum.INVALID_CUSTOMER_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            log.warn("[web-login] invalid password customerId={}", customer.getId());
            throw GlobalException.of(ValidationMessageEnum.INVALID_CUSTOMER_CREDENTIALS);
        }

        String token = jwtService.generate(customer.getId(), customer.getEmail(), customer.getName(), CUSTOMER_ROLE);
        log.info("[web-login] OK customerId={}", customer.getId());
        return new WebLoginResponse(token, customer.getId(), customer.getName(), customer.getEmail(), customer.getPhone());
    }

    private void validate(WebLoginRequest request) {
        if (request == null || isBlank(request.getLogin())) {
            throw GlobalException.of(ValidationMessageEnum.LOGIN_ID_REQUIRED);
        }
        if (isBlank(request.getPassword())) {
            throw GlobalException.of(ValidationMessageEnum.PASSWORD_REQUIRED);
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

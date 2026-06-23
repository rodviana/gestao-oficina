package com.gestaooficina.service;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.response.HomeResponse;
import com.gestaooficina.repository.AuthJdbcRepository;
import com.gestaooficina.repository.filter.UserEmailFilter;
import com.gestaooficina.model.record.UserRecord;
import org.springframework.stereotype.Service;

@Service
public class HomeService {

    private final AuthJdbcRepository authJdbcRepository;

    public HomeService(AuthJdbcRepository authJdbcRepository) {
        this.authJdbcRepository = authJdbcRepository;
    }

    public HomeResponse getHome(String email) {
        UserRecord user = authJdbcRepository.findByEmail(new UserEmailFilter(email))
                .orElseThrow(() -> GlobalException.of(ValidationMessageEnum.UNAUTHORIZED));

        return new HomeResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getCode(),
                "Welcome to Gestão Oficina, " + user.getName() + "!");
    }
}

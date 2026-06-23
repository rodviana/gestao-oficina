package com.gestaooficina.service;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.response.AdminPanelResponse;
import com.gestaooficina.repository.AuthJdbcRepository;
import com.gestaooficina.repository.filter.UserEmailFilter;
import com.gestaooficina.model.record.UserRecord;
import org.springframework.stereotype.Service;

@Service
public class AdminPanelService {

    private final AuthJdbcRepository authJdbcRepository;

    public AdminPanelService(AuthJdbcRepository authJdbcRepository) {
        this.authJdbcRepository = authJdbcRepository;
    }

    public AdminPanelResponse getPanel(String email) {
        UserRecord user = authJdbcRepository.findByEmail(new UserEmailFilter(email))
                .orElseThrow(() -> GlobalException.of(ValidationMessageEnum.UNAUTHORIZED));

        if (!user.getRole().isAdmin()) {
            throw GlobalException.of(ValidationMessageEnum.ACCESS_DENIED);
        }

        return new AdminPanelResponse(
                "Admin Panel",
                "Welcome to the workshop administration panel.",
                user.getName());
    }
}

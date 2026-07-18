package com.gestaooficina.service;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.request.CreateUserRequest;
import com.gestaooficina.model.response.CreateUserResponse;
import com.gestaooficina.model.enums.UserRoleEnum;
import com.gestaooficina.repository.AuthJdbcRepository;
import com.gestaooficina.repository.UserJdbcRepository;
import com.gestaooficina.repository.filter.CreateUserFilter;
import com.gestaooficina.repository.filter.UserEmailFilter;
import com.gestaooficina.model.record.UserRecord;
import com.gestaooficina.utils.UserValidationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminUserRegisterService {

    private static final Logger log = LoggerFactory.getLogger(AdminUserRegisterService.class);

    private final AuthJdbcRepository authJdbcRepository;
    private final UserJdbcRepository userJdbcRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserRegisterService(AuthJdbcRepository authJdbcRepository,
                                    UserJdbcRepository userJdbcRepository,
                                    PasswordEncoder passwordEncoder) {
        this.authJdbcRepository = authJdbcRepository;
        this.userJdbcRepository = userJdbcRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public CreateUserResponse createUser(String requesterEmail, CreateUserRequest request) {
        requireAdmin(requesterEmail);
        UserValidationUtils.validateCreateUserRequest(request);

        UserRoleEnum role;
        try {
            role = UserRoleEnum.fromCode(request.getRole());
        } catch (IllegalArgumentException ex) {
            throw GlobalException.of(ValidationMessageEnum.INVALID_ROLE);
        }

        if (role.isAdmin()) {
            throw GlobalException.of(ValidationMessageEnum.ADMIN_ROLE_NOT_ALLOWED);
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        CreateUserResponse created = userJdbcRepository.create(
                new CreateUserFilter(request, encodedPassword, role.getCode()));

        log.info("[user-create] OK id={} email={} role={}", created.getId(), created.getEmail(), created.getRole());
        return created;
    }

    private void requireAdmin(String email) {
        UserRecord requester = authJdbcRepository.findByEmail(new UserEmailFilter(email))
                .orElseThrow(() -> GlobalException.of(ValidationMessageEnum.UNAUTHORIZED));
        if (!requester.getRole().isAdmin()) {
            throw GlobalException.of(ValidationMessageEnum.ACCESS_DENIED);
        }
    }
}

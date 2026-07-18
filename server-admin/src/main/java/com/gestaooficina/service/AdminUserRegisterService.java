package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.enums.UserRoleEnum;
import com.gestaooficina.model.request.CreateUserRequest;
import com.gestaooficina.model.response.CreateUserResponse;
import com.gestaooficina.repository.UserRepository;
import com.gestaooficina.utils.UserValidationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminUserRegisterService {

    private static final Logger log = LoggerFactory.getLogger(AdminUserRegisterService.class);

    private final AuthSupport authSupport;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserRegisterService(AuthSupport authSupport,
                                    UserRepository userRepository,
                                    PasswordEncoder passwordEncoder) {
        this.authSupport = authSupport;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public CreateUserResponse createUser(String requesterEmail, CreateUserRequest request) {
        authSupport.requireAdmin(requesterEmail);
        UserValidationUtils.validateCreateUserRequest(request);

        UserRoleEnum role;
        try {
            role = UserRoleEnum.fromCode(request.getRole());
        } catch (IllegalArgumentException ex) {
            throw new GestaoOficinaGenericException("Perfil inválido.");
        }

        if (role.isAdmin()) {
            throw new GestaoOficinaGenericException("O perfil ADMIN não pode ser criado por este endpoint.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        CreateUserResponse created = userRepository.create(
                request.getEmail(),
                encodedPassword,
                request.getName(),
                role.getCode());

        log.info("[user-create] OK id={} email={} role={}", created.getId(), created.getEmail(), created.getRole());
        return created;
    }
}

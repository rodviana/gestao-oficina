package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.enums.UserRoleEnum;
import com.gestaooficina.model.record.UserRecord;
import com.gestaooficina.repository.AuthRepository;
import org.springframework.stereotype.Component;

@Component
public class AuthSupport {

    private final AuthRepository authRepository;

    public AuthSupport(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public UserRecord requireUser(String email) {
        return authRepository.findByEmail(email)
                .orElseThrow(() -> new GestaoOficinaForbiddenException("Não autorizado."));
    }

    public UserRecord requireAdmin(String email) {
        UserRecord user = requireUser(email);
        if (!user.isAdmin()) {
            throw new GestaoOficinaForbiddenException("Acesso negado.");
        }
        return user;
    }

    public void requireRole(String email, UserRoleEnum... allowed) {
        UserRecord user = requireUser(email);
        UserRoleEnum role;
        try {
            role = UserRoleEnum.fromCode(user.getRole());
        } catch (IllegalArgumentException ex) {
            throw new GestaoOficinaForbiddenException("Acesso negado.");
        }
        for (UserRoleEnum candidate : allowed) {
            if (role == candidate) {
                return;
            }
        }
        throw new GestaoOficinaForbiddenException("Acesso negado.");
    }

    public Long resolveUserId(Long jwtUserId, String email) {
        if (jwtUserId != null && jwtUserId > 0) {
            return jwtUserId;
        }
        UserRecord user = requireUser(email);
        if (user.getId() == null) {
            throw new GestaoOficinaGenericException("Usuário não encontrado.");
        }
        return user.getId();
    }
}

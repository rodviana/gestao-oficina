package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.model.response.AdminPanelResponse;
import com.gestaooficina.model.record.UserRecord;
import com.gestaooficina.repository.AuthRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminPanelService {

    private final AuthRepository authRepository;

    public AdminPanelService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public AdminPanelResponse getPanel(String email) {
        UserRecord user = authRepository.findByEmail(email)
                .orElseThrow(() -> new GestaoOficinaForbiddenException("Não autorizado."));

        if (!user.isAdmin()) {
            throw new GestaoOficinaForbiddenException("Acesso negado.");
        }

        return new AdminPanelResponse(
                "Admin Panel",
                "Welcome to the workshop administration panel.",
                user.getName());
    }
}

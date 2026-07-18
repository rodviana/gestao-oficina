package com.gestaooficina.service;

import com.gestaooficina.model.response.HomeResponse;
import com.gestaooficina.model.record.UserRecord;
import com.gestaooficina.repository.AuthRepository;
import org.springframework.stereotype.Service;

@Service
public class HomeService {

    private final AuthRepository authRepository;

    public HomeService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public HomeResponse getHome(String email) {
        UserRecord user = authRepository.findByEmail(email)
                .orElseThrow(() -> new com.gestaooficina.exception.GestaoOficinaForbiddenException("Não autorizado."));

        return new HomeResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                "Welcome to Gestão Oficina, " + user.getName() + "!");
    }
}

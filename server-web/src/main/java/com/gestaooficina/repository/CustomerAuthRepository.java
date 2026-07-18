package com.gestaooficina.repository;

import com.gestaooficina.model.dto.CustomerAccountDto;

import java.util.Optional;

public interface CustomerAuthRepository {

    Optional<CustomerAccountDto> findByLogin(String login);
}

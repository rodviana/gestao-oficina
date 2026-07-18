package com.gestaooficina.repository;

import com.gestaooficina.model.record.UserRecord;

import java.util.Optional;

public interface AuthRepository {

    Optional<UserRecord> findByEmail(String email);
}

package com.gestaooficina.repository;

import com.gestaooficina.repository.filter.UserEmailFilter;
import com.gestaooficina.model.record.UserRecord;

import java.util.Optional;

public interface AuthJdbcRepository {

    String P_FIND_USER_BY_EMAIL = "SELECT * FROM p_find_user_by_email(:email)";

    Optional<UserRecord> findByEmail(UserEmailFilter filter);
}

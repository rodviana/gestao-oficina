package com.gestaooficina.repository.impl;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.repository.AuthJdbcRepository;
import com.gestaooficina.repository.filter.UserEmailFilter;
import com.gestaooficina.repository.mapper.UserRowMapper;
import com.gestaooficina.model.record.UserRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class AuthJdbcRepositoryImpl implements AuthJdbcRepository {

    private static final Logger log = LoggerFactory.getLogger(AuthJdbcRepositoryImpl.class);

    private final NamedParameterJdbcTemplate jdbc;

    public AuthJdbcRepositoryImpl(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Optional<UserRecord> findByEmail(UserEmailFilter filter) {
        String email = filter.getEmail();
        MapSqlParameterSource params = new MapSqlParameterSource("email", email);
        try {
            log.info("[auth] exec p_find_user_by_email email={}", email);
            List<UserRecord> rows = jdbc.query(P_FIND_USER_BY_EMAIL, params, UserRowMapper.INSTANCE);
            return rows.stream().findFirst();
        } catch (DataAccessException e) {
            log.error("[auth] JDBC error email={}: {}", email, e.getMessage(), e);
            throw GlobalException.of(ValidationMessageEnum.FAILED_LOAD_USER);
        }
    }
}

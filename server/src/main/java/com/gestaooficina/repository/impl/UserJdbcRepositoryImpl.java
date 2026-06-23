package com.gestaooficina.repository.impl;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.response.CreateUserResponse;
import com.gestaooficina.repository.UserJdbcRepository;
import com.gestaooficina.repository.filter.CreateUserFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class UserJdbcRepositoryImpl implements UserJdbcRepository {

    private static final Logger log = LoggerFactory.getLogger(UserJdbcRepositoryImpl.class);

    private final NamedParameterJdbcTemplate jdbc;

    public UserJdbcRepositoryImpl(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public CreateUserResponse create(CreateUserFilter filter) {
        String email = filter.getEmail();
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("email", email)
                .addValue("password", filter.getEncodedPassword())
                .addValue("name", filter.getName())
                .addValue("role", filter.getRoleDbValue());

        try {
            log.info("[user-create] exec p_create_user email={}", email);
            List<Map<String, Object>> rows = jdbc.queryForList(P_CREATE_USER, params);
            if (rows.isEmpty()) {
                throw GlobalException.of(ValidationMessageEnum.FAILED_CREATE_USER);
            }

            Map<String, Object> row = rows.get(0);
            int errorCode = toInt(row.get("error_code"));
            if (errorCode != 0) {
                throw GlobalException.fromUserProcedure(errorCode, stringValue(row.get("error_message")));
            }

            Long userId = toLong(row.get("user_id"));
            if (userId == null || userId <= 0) {
                throw GlobalException.of(ValidationMessageEnum.FAILED_CREATE_USER);
            }

            return new CreateUserResponse(userId, filter.getName(), email.toLowerCase().trim(), filter.getRoleDbValue());
        } catch (GlobalException e) {
            throw e;
        } catch (DataAccessException e) {
            log.error("[user-create] JDBC error email={}: {}", email, e.getMessage(), e);
            throw GlobalException.of(ValidationMessageEnum.FAILED_CREATE_USER);
        }
    }

    private static int toInt(Object value) {
        if (value == null) {
            return 0;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return Integer.parseInt(value.toString());
    }

    private static Long toLong(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return Long.parseLong(value.toString());
    }

    private static String stringValue(Object value) {
        return value != null ? value.toString() : null;
    }
}

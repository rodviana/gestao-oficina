package com.gestaooficina.repository.jdbc;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.record.UserRecord;
import com.gestaooficina.repository.AuthRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import com.gestaooficina.utils.UserValidationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class AuthJdbcRepository implements AuthRepository {

    private static final Logger log = LoggerFactory.getLogger(AuthJdbcRepository.class);
    private static final String SQL_FIND_BY_EMAIL = "SELECT * FROM fn_user_find_by_email(?)";

    private final JdbcProcedureExecutor executor;

    public AuthJdbcRepository(JdbcProcedureExecutor executor) {
        this.executor = executor;
    }

    @Override
    public Optional<UserRecord> findByEmail(String email) {
        try {
            log.info("[auth] fn_user_find_by_email email={}", email);
            return executor.queryOptional(SQL_FIND_BY_EMAIL, userRowMapper(), email);
        } catch (DataAccessException e) {
            log.error("[auth] JDBC error email={}: {}", email, e.getMessage(), e);
            throw new GestaoOficinaGenericException(
                    UserValidationUtils.jdbcErrorMessage(e, "Falha ao carregar usuário."));
        }
    }

    private RowMapper<UserRecord> userRowMapper() {
        return (rs, rowNum) -> new UserRecord(
                rs.getLong("id"),
                rs.getString("email"),
                rs.getString("password"),
                rs.getString("name"),
                rs.getString("role"),
                rs.getBoolean("active"));
    }
}

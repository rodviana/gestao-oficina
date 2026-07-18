package com.gestaooficina.repository.jdbc;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.response.CreateUserResponse;
import com.gestaooficina.repository.UserRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import com.gestaooficina.utils.UserValidationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class UserJdbcRepository implements UserRepository {

    private static final Logger log = LoggerFactory.getLogger(UserJdbcRepository.class);
    private static final String SQL_CREATE = "SELECT * FROM fn_user_create(?, ?, ?, ?)";

    private final JdbcProcedureExecutor executor;

    public UserJdbcRepository(JdbcProcedureExecutor executor) {
        this.executor = executor;
    }

    @Override
    public CreateUserResponse create(String email, String encodedPassword, String name, String roleCode) {
        try {
            log.info("[user-create] fn_user_create email={}", email);
            List<Map<String, Object>> rows = executor.query(
                    SQL_CREATE,
                    procedureResultRowMapper(),
                    email,
                    encodedPassword,
                    name,
                    roleCode);

            if (rows.isEmpty()) {
                throw new GestaoOficinaGenericException("Falha ao criar usuário.");
            }

            Map<String, Object> row = rows.get(0);
            int errorCode = toInt(row.get("error_code"));
            if (errorCode != 0) {
                throw userCreateError(errorCode, stringValue(row.get("error_message")));
            }

            Long userId = toLong(row.get("user_id"));
            if (userId == null || userId <= 0) {
                throw new GestaoOficinaGenericException("Falha ao criar usuário.");
            }

            return new CreateUserResponse(userId, name, email.toLowerCase().trim(), roleCode);
        } catch (GestaoOficinaGenericException e) {
            throw e;
        } catch (DataAccessException e) {
            log.error("[user-create] JDBC error email={}: {}", email, e.getMessage(), e);
            throw new GestaoOficinaGenericException(
                    UserValidationUtils.jdbcErrorMessage(e, "Falha ao criar usuário."));
        }
    }

    @SuppressWarnings("unchecked")
    private RowMapper<Map<String, Object>> procedureResultRowMapper() {
        return (rs, rowNum) -> {
            java.sql.ResultSetMetaData meta = rs.getMetaData();
            Map<String, Object> row = new java.util.LinkedHashMap<>();
            for (int i = 1; i <= meta.getColumnCount(); i++) {
                row.put(meta.getColumnLabel(i), rs.getObject(i));
            }
            return row;
        };
    }

    private static GestaoOficinaGenericException userCreateError(int errorCode, String procedureMessage) {
        switch (errorCode) {
            case 1:
                return new GestaoOficinaGenericException("E-mail já cadastrado.");
            case 2:
                return new GestaoOficinaGenericException("Perfil inválido.");
            case 3:
                return new GestaoOficinaGenericException("E-mail é obrigatório.");
            default:
                if (procedureMessage != null && !procedureMessage.isBlank()) {
                    return new GestaoOficinaGenericException(procedureMessage);
                }
                return new GestaoOficinaGenericException("Falha ao criar usuário.");
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

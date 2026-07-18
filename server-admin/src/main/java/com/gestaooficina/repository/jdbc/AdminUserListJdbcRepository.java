package com.gestaooficina.repository.jdbc;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.response.UserListItemResponse;
import com.gestaooficina.repository.AdminUserListRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import com.gestaooficina.utils.UserValidationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class AdminUserListJdbcRepository implements AdminUserListRepository {

    private static final Logger log = LoggerFactory.getLogger(AdminUserListJdbcRepository.class);
    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final String SQL_COUNT = "SELECT fn_user_count_filtered(?, ?, ?, ?)";
    private static final String SQL_FIND = "SELECT * FROM fn_user_find_filtered(?, ?, ?, ?, ?, ?)";

    private final JdbcProcedureExecutor executor;

    public AdminUserListJdbcRepository(JdbcProcedureExecutor executor) {
        this.executor = executor;
    }

    @Override
    public long countUsers(String role, String activeFilter, String searchField, String searchText) {
        try {
            Long total = executor.queryScalar(SQL_COUNT, Long.class, role, activeFilter, searchField, searchText);
            return total != null ? total : 0L;
        } catch (DataAccessException e) {
            log.error("[user-list] count JDBC error: {}", e.getMessage(), e);
            throw new GestaoOficinaGenericException(
                    UserValidationUtils.jdbcErrorMessage(e, "Falha ao carregar usuários."));
        }
    }

    @Override
    public List<UserListItemResponse> findUsersPage(String role, String activeFilter, String searchField,
                                                    String searchText, int page, int pageSize) {
        try {
            log.info("[user-list] fn_user_find_filtered page={} pageSize={}", page, pageSize);
            return executor.query(SQL_FIND, listItemRowMapper(), role, activeFilter, searchField, searchText, page, pageSize);
        } catch (DataAccessException e) {
            log.error("[user-list] list JDBC error: {}", e.getMessage(), e);
            throw new GestaoOficinaGenericException(
                    UserValidationUtils.jdbcErrorMessage(e, "Falha ao carregar usuários."));
        }
    }

    private RowMapper<UserListItemResponse> listItemRowMapper() {
        return (rs, rowNum) -> {
            Timestamp createdAt = rs.getTimestamp("created_at");
            String formattedDate = createdAt != null
                    ? createdAt.toLocalDateTime().format(DATE_TIME_FORMAT)
                    : null;
            return new UserListItemResponse(
                    rs.getLong("id"),
                    rs.getString("email"),
                    rs.getString("name"),
                    rs.getString("role"),
                    rs.getBoolean("active"),
                    formattedDate);
        };
    }
}

package com.gestaooficina.repository.jdbc;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.CustomerDTO;
import com.gestaooficina.repository.CustomerRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import com.gestaooficina.utils.JdbcMappingUtils;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CustomerJdbcRepository implements CustomerRepository {

    private static final String SQL_FIND_BY_ID = "SELECT * FROM fn_customer_find_by_id(?)";
    private static final String SQL_FIND_BY_PHONE = "SELECT * FROM fn_customer_find_by_phone(?)";
    private static final String SQL_COUNT = "SELECT fn_customer_count_search(?)";
    private static final String SQL_SEARCH = "SELECT * FROM fn_customer_search(?, ?, ?)";
    private static final String SQL_INSERT = "SELECT fn_customer_insert(?, ?, ?)";
    private static final String SQL_UPDATE = "SELECT fn_customer_update(?, ?, ?, ?, ?)";

    private final JdbcProcedureExecutor executor;

    public CustomerJdbcRepository(JdbcProcedureExecutor executor) {
        this.executor = executor;
    }

    @Override
    public Optional<CustomerDTO> findById(Long id) {
        return queryOptional(SQL_FIND_BY_ID, id);
    }

    @Override
    public List<CustomerDTO> findByPhone(String phone) {
        return queryList(SQL_FIND_BY_PHONE, phone);
    }

    @Override
    public long countSearch(String search) {
        try {
            Long total = executor.queryScalar(SQL_COUNT, Long.class, search);
            return total != null ? total : 0L;
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar clientes.");
        }
    }

    @Override
    public List<CustomerDTO> search(String search, int page, int pageSize) {
        return queryList(SQL_SEARCH, search, page, pageSize);
    }

    @Override
    public Long insert(String name, String document, String phone) {
        try {
            return executor.queryScalar(SQL_INSERT, Long.class, name, document, phone);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao criar cliente.");
        }
    }

    @Override
    public void update(Long id, String name, String document, String phone, Boolean active) {
        try {
            executor.execute(SQL_UPDATE, id, name, document, phone, active);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao atualizar cliente.");
        }
    }

    private Optional<CustomerDTO> queryOptional(String sql, Object... args) {
        try {
            return executor.queryOptional(sql, rowMapper(), args);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar cliente.");
        }
    }

    private List<CustomerDTO> queryList(String sql, Object... args) {
        try {
            return executor.query(sql, rowMapper(), args);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar clientes.");
        }
    }

    private RowMapper<CustomerDTO> rowMapper() {
        return (rs, rowNum) -> new CustomerDTO(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("document"),
                rs.getString("phone"),
                rs.getBoolean("active"),
                JdbcMappingUtils.toInstant(rs.getTimestamp("created_at")),
                rs.getBoolean("has_account"),
                rs.getLong("vehicle_count"));
    }

    private GestaoOficinaGenericException jdbcError(DataAccessException e, String fallback) {
        return new GestaoOficinaGenericException(UserValidationUtils.jdbcErrorMessage(e, fallback));
    }
}

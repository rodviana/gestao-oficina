package com.gestaooficina.repository.jdbc;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.QuickSearchResultDTO;
import com.gestaooficina.repository.QuickSearchRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class QuickSearchJdbcRepository implements QuickSearchRepository {

    private static final String SQL_SEARCH = "SELECT * FROM fn_quick_search(?)";

    private final JdbcProcedureExecutor executor;

    public QuickSearchJdbcRepository(JdbcProcedureExecutor executor) {
        this.executor = executor;
    }

    @Override
    public List<QuickSearchResultDTO> search(String query) {
        try {
            return executor.query(SQL_SEARCH, rowMapper(), query);
        } catch (DataAccessException e) {
            throw new GestaoOficinaGenericException(
                    UserValidationUtils.jdbcErrorMessage(e, "Falha na busca rápida."));
        }
    }

    private RowMapper<QuickSearchResultDTO> rowMapper() {
        return (rs, rowNum) -> new QuickSearchResultDTO(
                rs.getString("result_type"),
                rs.getLong("id"),
                rs.getString("label"),
                rs.getString("subtitle"),
                (Long) rs.getObject("customer_id"),
                (Long) rs.getObject("vehicle_id"));
    }
}

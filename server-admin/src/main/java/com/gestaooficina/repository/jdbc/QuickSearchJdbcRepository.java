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

    private static final String SQL_COUNT = "SELECT fn_quick_search_count(?)";
    private static final String SQL_SEARCH = "SELECT * FROM fn_quick_search(?, ?, ?)";

    private final JdbcProcedureExecutor executor;

    public QuickSearchJdbcRepository(JdbcProcedureExecutor executor) {
        this.executor = executor;
    }

    @Override
    public long count(String query) {
        try {
            Long total = executor.queryScalar(SQL_COUNT, Long.class, query);
            return total != null ? total : 0L;
        } catch (DataAccessException e) {
            throw new GestaoOficinaGenericException(
                    UserValidationUtils.jdbcErrorMessage(e, "Falha na busca rápida."));
        }
    }

    @Override
    public List<QuickSearchResultDTO> search(String query, int page, int pageSize) {
        try {
            return executor.query(SQL_SEARCH, rowMapper(), query, page, pageSize);
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

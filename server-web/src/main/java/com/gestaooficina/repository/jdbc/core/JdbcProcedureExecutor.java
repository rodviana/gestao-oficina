package com.gestaooficina.repository.jdbc.core;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class JdbcProcedureExecutor {

    private static final Logger log = LoggerFactory.getLogger(JdbcProcedureExecutor.class);

    private final JdbcTemplate jdbcTemplate;

    public JdbcProcedureExecutor(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public <T> List<T> queryList(String sql, RowMapper<T> mapper, Object... args) {
        try {
            return jdbcTemplate.query(sql, mapper, args);
        } catch (DataAccessException e) {
            log.error("[jdbc] query failed sql={}: {}", sql, e.getMessage(), e);
            throw new GestaoOficinaGenericException("Falha ao consultar o banco de dados.");
        }
    }

    public <T> Optional<T> queryOne(String sql, RowMapper<T> mapper, Object... args) {
        return queryList(sql, mapper, args).stream().findFirst();
    }
}

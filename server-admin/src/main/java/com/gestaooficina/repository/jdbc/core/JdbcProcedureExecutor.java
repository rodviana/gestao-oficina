package com.gestaooficina.repository.jdbc.core;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class JdbcProcedureExecutor {

    private final JdbcTemplate jdbcTemplate;

    public JdbcProcedureExecutor(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public <T> List<T> query(String sql, RowMapper<T> rowMapper, Object... args) {
        return jdbcTemplate.query(sql, rowMapper, args);
    }

    public <T> Optional<T> queryOptional(String sql, RowMapper<T> rowMapper, Object... args) {
        try {
            T result = jdbcTemplate.queryForObject(sql, rowMapper, args);
            return Optional.ofNullable(result);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public <T> T queryScalar(String sql, Class<T> clazz, Object... args) {
        return jdbcTemplate.queryForObject(sql, clazz, args);
    }

    public int execute(String sql, Object... args) {
        String normalized = sql == null ? "" : sql.stripLeading().toUpperCase();
        if (normalized.startsWith("SELECT")) {
            try {
                Object ignored = jdbcTemplate.queryForObject(sql, Object.class, args);
                return ignored == null ? 0 : 1;
            } catch (EmptyResultDataAccessException e) {
                return 1;
            }
        }
        return jdbcTemplate.update(sql, args);
    }
}

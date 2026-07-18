package com.gestaooficina.repository.jdbc;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.PartCatalogDTO;
import com.gestaooficina.repository.PartCatalogRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import com.gestaooficina.utils.JdbcMappingUtils;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class PartCatalogJdbcRepository implements PartCatalogRepository {

    private static final String SQL_LIST = "SELECT * FROM fn_part_catalog_list(?)";
    private static final String SQL_FIND = "SELECT * FROM fn_part_catalog_find_by_id(?)";
    private static final String SQL_INSERT = "SELECT fn_part_catalog_insert(?, ?)";
    private static final String SQL_UPDATE = "SELECT fn_part_catalog_update(?, ?, ?)";

    private final JdbcProcedureExecutor executor;

    public PartCatalogJdbcRepository(JdbcProcedureExecutor executor) {
        this.executor = executor;
    }

    @Override
    public List<PartCatalogDTO> list(Boolean onlyActive) {
        try {
            return executor.query(SQL_LIST, rowMapper(), onlyActive != null && onlyActive);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao listar peças.");
        }
    }

    @Override
    public Optional<PartCatalogDTO> findById(Long id) {
        try {
            return executor.queryOptional(SQL_FIND, rowMapper(), id);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar peça.");
        }
    }

    @Override
    public Long insert(String name, Boolean active) {
        try {
            return executor.queryScalar(SQL_INSERT, Long.class, name, active);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao criar peça.");
        }
    }

    @Override
    public void update(Long id, String name, Boolean active) {
        try {
            executor.execute(SQL_UPDATE, id, name, active);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao atualizar peça.");
        }
    }

    private RowMapper<PartCatalogDTO> rowMapper() {
        return (rs, rowNum) -> new PartCatalogDTO(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getBoolean("active"),
                JdbcMappingUtils.toInstant(rs.getTimestamp("created_at")));
    }

    private GestaoOficinaGenericException jdbcError(DataAccessException e, String fallback) {
        return new GestaoOficinaGenericException(UserValidationUtils.jdbcErrorMessage(e, fallback));
    }
}

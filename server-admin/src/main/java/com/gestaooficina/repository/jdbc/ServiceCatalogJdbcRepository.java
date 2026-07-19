package com.gestaooficina.repository.jdbc;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.ServiceCatalogDTO;
import com.gestaooficina.repository.ServiceCatalogRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import com.gestaooficina.utils.JdbcMappingUtils;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public class ServiceCatalogJdbcRepository implements ServiceCatalogRepository {

    private static final String SQL_COUNT = "SELECT fn_service_catalog_count(?, ?)";
    private static final String SQL_LIST = "SELECT * FROM fn_service_catalog_list(?, ?, ?, ?)";
    private static final String SQL_FIND = "SELECT * FROM fn_service_catalog_find_by_id(?)";
    private static final String SQL_INSERT = "SELECT fn_service_catalog_insert(?, ?, ?)";
    private static final String SQL_UPDATE = "SELECT fn_service_catalog_update(?, ?, ?, ?)";

    private final JdbcProcedureExecutor executor;

    public ServiceCatalogJdbcRepository(JdbcProcedureExecutor executor) {
        this.executor = executor;
    }

    @Override
    public long count(Boolean onlyActive, String search) {
        try {
            Long total = executor.queryScalar(
                    SQL_COUNT, Long.class, onlyActive != null && onlyActive, search);
            return total != null ? total : 0L;
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao contar serviços.");
        }
    }

    @Override
    public List<ServiceCatalogDTO> list(Boolean onlyActive, String search, int page, int pageSize) {
        try {
            return executor.query(
                    SQL_LIST, rowMapper(), onlyActive != null && onlyActive, search, page, pageSize);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao listar serviços.");
        }
    }

    @Override
    public Optional<ServiceCatalogDTO> findById(Long id) {
        try {
            return executor.queryOptional(SQL_FIND, rowMapper(), id);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar serviço.");
        }
    }

    @Override
    public Long insert(String name, BigDecimal defaultPrice, Boolean active) {
        try {
            return executor.queryScalar(SQL_INSERT, Long.class, name, defaultPrice, active);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao criar serviço.");
        }
    }

    @Override
    public void update(Long id, String name, BigDecimal defaultPrice, Boolean active) {
        try {
            executor.execute(SQL_UPDATE, id, name, defaultPrice, active);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao atualizar serviço.");
        }
    }

    private RowMapper<ServiceCatalogDTO> rowMapper() {
        return (rs, rowNum) -> new ServiceCatalogDTO(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getBigDecimal("default_price"),
                rs.getBoolean("active"),
                JdbcMappingUtils.toInstant(rs.getTimestamp("created_at")));
    }

    private GestaoOficinaGenericException jdbcError(DataAccessException e, String fallback) {
        return new GestaoOficinaGenericException(UserValidationUtils.jdbcErrorMessage(e, fallback));
    }
}

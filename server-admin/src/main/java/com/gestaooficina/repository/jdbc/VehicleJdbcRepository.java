package com.gestaooficina.repository.jdbc;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.VehicleDTO;
import com.gestaooficina.model.dto.WorkOrderSummaryDTO;
import com.gestaooficina.repository.VehicleRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import com.gestaooficina.utils.JdbcMappingUtils;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class VehicleJdbcRepository implements VehicleRepository {

    private static final String SQL_FIND_BY_ID = "SELECT * FROM fn_vehicle_find_by_id(?)";
    private static final String SQL_FIND_BY_PLATE = "SELECT * FROM fn_vehicle_find_by_plate(?)";
    private static final String SQL_COUNT_BY_CUSTOMER = "SELECT fn_vehicle_count_by_customer(?)";
    private static final String SQL_FIND_BY_CUSTOMER = "SELECT * FROM fn_vehicle_find_by_customer(?, ?, ?)";
    private static final String SQL_COUNT = "SELECT fn_vehicle_count_search(?)";
    private static final String SQL_SEARCH = "SELECT * FROM fn_vehicle_search(?, ?, ?)";
    private static final String SQL_HISTORY_COUNT = "SELECT fn_work_order_count_by_vehicle(?)";
    private static final String SQL_HISTORY = "SELECT * FROM fn_work_order_by_vehicle(?, ?, ?)";
    private static final String SQL_INSERT = "SELECT fn_vehicle_insert(?, ?, ?, ?, ?)";
    private static final String SQL_UPDATE = "SELECT fn_vehicle_update(?, ?, ?, ?, ?, ?, ?)";

    private final JdbcProcedureExecutor executor;

    public VehicleJdbcRepository(JdbcProcedureExecutor executor) {
        this.executor = executor;
    }

    @Override
    public Optional<VehicleDTO> findById(Long id) {
        return queryOptional(SQL_FIND_BY_ID, id);
    }

    @Override
    public Optional<VehicleDTO> findByPlate(String plate) {
        return queryOptional(SQL_FIND_BY_PLATE, plate);
    }

    @Override
    public long countByCustomer(Long customerId) {
        try {
            Long total = executor.queryScalar(SQL_COUNT_BY_CUSTOMER, Long.class, customerId);
            return total != null ? total : 0L;
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao contar veículos do cliente.");
        }
    }

    @Override
    public List<VehicleDTO> findByCustomer(Long customerId, int page, int pageSize) {
        return queryList(SQL_FIND_BY_CUSTOMER, customerId, page, pageSize);
    }

    @Override
    public long countSearch(String search) {
        try {
            Long total = executor.queryScalar(SQL_COUNT, Long.class, search);
            return total != null ? total : 0L;
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar veículos.");
        }
    }

    @Override
    public List<VehicleDTO> search(String search, int page, int pageSize) {
        return queryList(SQL_SEARCH, search, page, pageSize);
    }

    @Override
    public long countWorkOrderHistory(Long vehicleId) {
        try {
            Long total = executor.queryScalar(SQL_HISTORY_COUNT, Long.class, vehicleId);
            return total != null ? total : 0L;
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao contar histórico do veículo.");
        }
    }

    @Override
    public List<WorkOrderSummaryDTO> findWorkOrderHistory(Long vehicleId, int page, int pageSize) {
        try {
            return executor.query(SQL_HISTORY, workOrderSummaryRowMapper(), vehicleId, page, pageSize);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar histórico do veículo.");
        }
    }

    @Override
    public Long insert(Long customerId, String plate, String brand, String model, Integer year) {
        try {
            return executor.queryScalar(SQL_INSERT, Long.class, customerId, plate, brand, model, year);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao criar veículo.");
        }
    }

    @Override
    public void update(Long id, Long customerId, String plate, String brand, String model, Integer year, Boolean active) {
        try {
            executor.execute(SQL_UPDATE, id, customerId, plate, brand, model, year, active);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao atualizar veículo.");
        }
    }

    private Optional<VehicleDTO> queryOptional(String sql, Object... args) {
        try {
            return executor.queryOptional(sql, vehicleRowMapper(), args);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar veículo.");
        }
    }

    private List<VehicleDTO> queryList(String sql, Object... args) {
        try {
            return executor.query(sql, vehicleRowMapper(), args);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar veículos.");
        }
    }

    private RowMapper<VehicleDTO> vehicleRowMapper() {
        return (rs, rowNum) -> new VehicleDTO(
                rs.getLong("id"),
                rs.getLong("customer_id"),
                rs.getString("customer_name"),
                rs.getString("plate"),
                rs.getString("brand"),
                rs.getString("model"),
                (Integer) rs.getObject("year"),
                rs.getBoolean("active"),
                JdbcMappingUtils.toInstant(rs.getTimestamp("created_at")));
    }

    private RowMapper<WorkOrderSummaryDTO> workOrderSummaryRowMapper() {
        return (rs, rowNum) -> {
            WorkOrderSummaryDTO dto = new WorkOrderSummaryDTO();
            dto.setId(rs.getLong("id"));
            dto.setNumber(rs.getString("number"));
            dto.setCustomerId(rs.getLong("customer_id"));
            dto.setCustomerName(rs.getString("customer_name"));
            dto.setVehicleId(rs.getLong("vehicle_id"));
            dto.setVehiclePlate(rs.getString("vehicle_plate"));
            dto.setDescription(rs.getString("description"));
            dto.setStatusCode(rs.getString("status_code"));
            dto.setStatusLabel(rs.getString("status_label"));
            dto.setPaymentStatusCode(rs.getString("payment_status_code"));
            dto.setPaymentStatusLabel(rs.getString("payment_status_label"));
            dto.setMechanicId((Long) rs.getObject("mechanic_id"));
            dto.setMechanicName(rs.getString("mechanic_name"));
            dto.setTotal(rs.getBigDecimal("total"));
            dto.setCreatedAt(JdbcMappingUtils.toInstant(rs.getTimestamp("created_at")));
            dto.setUpdatedAt(JdbcMappingUtils.toInstant(rs.getTimestamp("updated_at")));
            return dto;
        };
    }

    private GestaoOficinaGenericException jdbcError(DataAccessException e, String fallback) {
        return new GestaoOficinaGenericException(UserValidationUtils.jdbcErrorMessage(e, fallback));
    }
}

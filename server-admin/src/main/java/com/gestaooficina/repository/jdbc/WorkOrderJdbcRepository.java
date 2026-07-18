package com.gestaooficina.repository.jdbc;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.WorkOrderDTO;
import com.gestaooficina.model.dto.WorkOrderHistoryDTO;
import com.gestaooficina.model.dto.WorkOrderItemDTO;
import com.gestaooficina.model.dto.WorkOrderPanoramaDTO;
import com.gestaooficina.model.dto.WorkOrderSummaryDTO;
import com.gestaooficina.repository.WorkOrderRepository;
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
public class WorkOrderJdbcRepository implements WorkOrderRepository {

    private static final String SQL_FIND = "SELECT * FROM fn_work_order_find_by_id(?)";
    private static final String SQL_COUNT = "SELECT fn_work_order_count(?)";
    private static final String SQL_LIST = "SELECT * FROM fn_work_order_list(?, ?, ?)";
    private static final String SQL_INSERT = "SELECT fn_work_order_insert(?, ?, ?, ?, ?)";
    private static final String SQL_UPDATE_STATUS = "SELECT fn_work_order_update_status(?, ?, ?, ?)";
    private static final String SQL_UPDATE_PAYMENT = "SELECT fn_work_order_update_payment(?, ?)";
    private static final String SQL_ASSIGN_MECHANIC = "SELECT fn_work_order_assign_mechanic(?, ?)";
    private static final String SQL_ITEMS = "SELECT * FROM fn_work_order_items_by_order(?)";
    private static final String SQL_ITEM_INSERT =
            "SELECT fn_work_order_item_insert(?, ?, ?, ?, ?, ?, ?)";
    private static final String SQL_ITEM_UPDATE = "SELECT fn_work_order_item_update(?, ?, ?, ?)";
    private static final String SQL_ITEM_DELETE = "SELECT fn_work_order_item_delete(?)";
    private static final String SQL_HISTORY = "SELECT * FROM fn_work_order_history(?)";
    private static final String SQL_PANORAMA = "SELECT * FROM fn_work_order_panorama()";

    private final JdbcProcedureExecutor executor;

    public WorkOrderJdbcRepository(JdbcProcedureExecutor executor) {
        this.executor = executor;
    }

    @Override
    public Optional<WorkOrderDTO> findById(Long id) {
        try {
            return executor.queryOptional(SQL_FIND, detailRowMapper(), id);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar ordem de serviço.");
        }
    }

    @Override
    public long count(String statusCode) {
        try {
            Long total = executor.queryScalar(SQL_COUNT, Long.class, statusCode);
            return total != null ? total : 0L;
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao contar ordens de serviço.");
        }
    }

    @Override
    public List<WorkOrderSummaryDTO> list(String statusCode, int page, int pageSize) {
        try {
            return executor.query(SQL_LIST, summaryRowMapper(), statusCode, page, pageSize);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao listar ordens de serviço.");
        }
    }

    @Override
    public Long insert(Long customerId, Long vehicleId, String description, Long createdById, Long mechanicId) {
        try {
            return executor.queryScalar(
                    SQL_INSERT, Long.class, customerId, vehicleId, description, createdById, mechanicId);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao criar ordem de serviço.");
        }
    }

    @Override
    public void updateStatus(Long id, String statusCode, Long changedById, String note) {
        try {
            executor.execute(SQL_UPDATE_STATUS, id, statusCode, changedById, note);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao atualizar status da OS.");
        }
    }

    @Override
    public void updatePayment(Long id, String paymentCode) {
        try {
            executor.execute(SQL_UPDATE_PAYMENT, id, paymentCode);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao atualizar pagamento da OS.");
        }
    }

    @Override
    public void assignMechanic(Long id, Long mechanicId) {
        try {
            executor.execute(SQL_ASSIGN_MECHANIC, id, mechanicId);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao atribuir mecânico.");
        }
    }

    @Override
    public List<WorkOrderItemDTO> findItemsByOrder(Long workOrderId) {
        try {
            return executor.query(SQL_ITEMS, itemRowMapper(), workOrderId);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar itens da OS.");
        }
    }

    @Override
    public Long insertItem(Long workOrderId, String itemTypeCode, Long serviceId, Long partId,
                           String description, BigDecimal quantity, BigDecimal unitPrice) {
        try {
            return executor.queryScalar(
                    SQL_ITEM_INSERT, Long.class, workOrderId, itemTypeCode, serviceId, partId,
                    description, quantity, unitPrice);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao adicionar item.");
        }
    }

    @Override
    public void updateItem(Long itemId, BigDecimal quantity, BigDecimal unitPrice, String description) {
        try {
            executor.execute(SQL_ITEM_UPDATE, itemId, quantity, unitPrice, description);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao atualizar item.");
        }
    }

    @Override
    public void deleteItem(Long itemId) {
        try {
            executor.execute(SQL_ITEM_DELETE, itemId);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao remover item.");
        }
    }

    @Override
    public List<WorkOrderHistoryDTO> findHistory(Long workOrderId) {
        try {
            return executor.query(SQL_HISTORY, historyRowMapper(), workOrderId);
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao buscar histórico da OS.");
        }
    }

    @Override
    public List<WorkOrderPanoramaDTO> panorama() {
        try {
            return executor.query(SQL_PANORAMA, panoramaRowMapper());
        } catch (DataAccessException e) {
            throw jdbcError(e, "Falha ao carregar panorama.");
        }
    }

    private RowMapper<WorkOrderDTO> detailRowMapper() {
        return (rs, rowNum) -> {
            WorkOrderDTO dto = new WorkOrderDTO();
            dto.setId(rs.getLong("id"));
            dto.setNumber(rs.getString("number"));
            dto.setCustomerId(rs.getLong("customer_id"));
            dto.setCustomerName(rs.getString("customer_name"));
            dto.setCustomerPhone(rs.getString("customer_phone"));
            dto.setVehicleId(rs.getLong("vehicle_id"));
            dto.setVehiclePlate(rs.getString("vehicle_plate"));
            dto.setVehicleBrand(rs.getString("vehicle_brand"));
            dto.setVehicleModel(rs.getString("vehicle_model"));
            dto.setVehicleYear((Integer) rs.getObject("vehicle_year"));
            dto.setDescription(rs.getString("description"));
            dto.setStatusCode(rs.getString("status_code"));
            dto.setStatusLabel(rs.getString("status_label"));
            dto.setPaymentStatusCode(rs.getString("payment_status_code"));
            dto.setPaymentStatusLabel(rs.getString("payment_status_label"));
            dto.setMechanicId((Long) rs.getObject("mechanic_id"));
            dto.setMechanicName(rs.getString("mechanic_name"));
            dto.setCreatedById(rs.getLong("created_by_id"));
            dto.setCreatedByName(rs.getString("created_by_name"));
            dto.setTotal(rs.getBigDecimal("total"));
            dto.setCreatedAt(JdbcMappingUtils.toInstant(rs.getTimestamp("created_at")));
            dto.setUpdatedAt(JdbcMappingUtils.toInstant(rs.getTimestamp("updated_at")));
            return dto;
        };
    }

    private RowMapper<WorkOrderSummaryDTO> summaryRowMapper() {
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

    private RowMapper<WorkOrderItemDTO> itemRowMapper() {
        return (rs, rowNum) -> {
            WorkOrderItemDTO dto = new WorkOrderItemDTO();
            dto.setId(rs.getLong("id"));
            dto.setWorkOrderId(rs.getLong("work_order_id"));
            dto.setItemTypeCode(rs.getString("item_type_code"));
            dto.setItemTypeLabel(rs.getString("item_type_label"));
            dto.setServiceId((Long) rs.getObject("service_id"));
            dto.setPartId((Long) rs.getObject("part_id"));
            dto.setDescription(rs.getString("description"));
            dto.setQuantity(rs.getBigDecimal("quantity"));
            dto.setUnitPrice(rs.getBigDecimal("unit_price"));
            dto.setLineTotal(rs.getBigDecimal("line_total"));
            dto.setCreatedAt(JdbcMappingUtils.toInstant(rs.getTimestamp("created_at")));
            return dto;
        };
    }

    private RowMapper<WorkOrderHistoryDTO> historyRowMapper() {
        return (rs, rowNum) -> {
            WorkOrderHistoryDTO dto = new WorkOrderHistoryDTO();
            dto.setId(rs.getLong("id"));
            dto.setStatusCode(rs.getString("status_code"));
            dto.setStatusLabel(rs.getString("status_label"));
            dto.setNote(rs.getString("note"));
            dto.setChangedById((Long) rs.getObject("changed_by_id"));
            dto.setChangedByName(rs.getString("changed_by_name"));
            dto.setChangedAt(JdbcMappingUtils.toInstant(rs.getTimestamp("changed_at")));
            return dto;
        };
    }

    private RowMapper<WorkOrderPanoramaDTO> panoramaRowMapper() {
        return (rs, rowNum) -> new WorkOrderPanoramaDTO(
                rs.getString("status_code"),
                rs.getString("status_label"),
                rs.getInt("display_order"),
                rs.getLong("order_count"));
    }

    private GestaoOficinaGenericException jdbcError(DataAccessException e, String fallback) {
        return new GestaoOficinaGenericException(UserValidationUtils.jdbcErrorMessage(e, fallback));
    }
}

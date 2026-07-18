package com.gestaooficina.repository.jdbc;

import com.gestaooficina.model.dto.WorkOrderDetailDto;
import com.gestaooficina.model.dto.WorkOrderItemDto;
import com.gestaooficina.model.dto.WorkOrderTimelineEntryDto;
import com.gestaooficina.repository.WorkOrderRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class WorkOrderJdbcRepository implements WorkOrderRepository {

    private static final String FN_WORK_ORDER_FIND_BY_ID =
            "SELECT * FROM fn_work_order_find_by_id(?)";

    private static final String FN_WORK_ORDER_TRACK =
            "SELECT * FROM fn_work_order_track(?, ?)";

    private static final String FN_WORK_ORDER_ITEMS_BY_ORDER =
            "SELECT * FROM fn_work_order_items_by_order(?)";

    private static final String FN_WORK_ORDER_HISTORY =
            "SELECT * FROM fn_work_order_history(?)";

    private static final RowMapper<WorkOrderDetailDto> DETAIL_MAPPER = (rs, rowNum) -> {
        WorkOrderDetailDto dto = new WorkOrderDetailDto();
        dto.setId(rs.getLong("id"));
        dto.setNumber(rs.getString("number"));
        dto.setDescription(rs.getString("description"));
        dto.setStatus(rs.getString("status_code"));
        dto.setStatusLabel(rs.getString("status_label"));
        dto.setPaymentStatus(rs.getString("payment_status_code"));
        dto.setPaymentStatusLabel(rs.getString("payment_status_label"));
        dto.setTotal(rs.getBigDecimal("total"));
        dto.setCreatedAt(toLocalDateTime(rs.getTimestamp("created_at")));
        dto.setUpdatedAt(toLocalDateTime(rs.getTimestamp("updated_at")));
        return dto;
    };

    private static final RowMapper<WorkOrderDetailDto> FIND_BY_ID_MAPPER = (rs, rowNum) -> {
        WorkOrderDetailDto dto = DETAIL_MAPPER.mapRow(rs, rowNum);
        dto.setCustomerId(rs.getLong("customer_id"));
        dto.setVehicleId(rs.getLong("vehicle_id"));
        dto.setVehiclePlate(rs.getString("vehicle_plate"));
        dto.setVehicleBrand(rs.getString("vehicle_brand"));
        dto.setVehicleModel(rs.getString("vehicle_model"));
        dto.setVehicleYear(rs.getObject("vehicle_year", Integer.class));
        dto.setCustomerName(rs.getString("customer_name"));
        return dto;
    };

    private static final RowMapper<WorkOrderDetailDto> TRACK_MAPPER = (rs, rowNum) -> {
        WorkOrderDetailDto dto = DETAIL_MAPPER.mapRow(rs, rowNum);
        dto.setVehiclePlate(rs.getString("vehicle_plate"));
        dto.setVehicleBrand(rs.getString("vehicle_brand"));
        dto.setVehicleModel(rs.getString("vehicle_model"));
        dto.setVehicleYear(rs.getObject("vehicle_year", Integer.class));
        dto.setCustomerName(rs.getString("customer_name"));
        return dto;
    };

    private static final RowMapper<WorkOrderItemDto> ITEM_MAPPER = (rs, rowNum) -> {
        WorkOrderItemDto dto = new WorkOrderItemDto();
        dto.setId(rs.getLong("id"));
        dto.setType(rs.getString("item_type_code"));
        dto.setTypeLabel(rs.getString("item_type_label"));
        dto.setDescription(rs.getString("description"));
        dto.setQuantity(rs.getBigDecimal("quantity"));
        dto.setUnitPrice(rs.getBigDecimal("unit_price"));
        dto.setLineTotal(rs.getBigDecimal("line_total"));
        return dto;
    };

    private static final RowMapper<WorkOrderTimelineEntryDto> HISTORY_MAPPER = (rs, rowNum) -> {
        WorkOrderTimelineEntryDto dto = new WorkOrderTimelineEntryDto();
        dto.setId(rs.getLong("id"));
        dto.setStatus(rs.getString("status_code"));
        dto.setStatusLabel(rs.getString("status_label"));
        dto.setNote(rs.getString("note"));
        dto.setAt(toLocalDateTime(rs.getTimestamp("changed_at")));
        return dto;
    };

    private final JdbcProcedureExecutor jdbc;

    public WorkOrderJdbcRepository(JdbcProcedureExecutor jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Optional<WorkOrderDetailDto> findById(Long id) {
        return jdbc.queryOne(FN_WORK_ORDER_FIND_BY_ID, FIND_BY_ID_MAPPER, id);
    }

    @Override
    public Optional<WorkOrderDetailDto> trackByNumberAndPlate(String number, String plate) {
        return jdbc.queryOne(FN_WORK_ORDER_TRACK, TRACK_MAPPER, number, plate);
    }

    @Override
    public List<WorkOrderItemDto> findItemsByOrderId(Long workOrderId) {
        return jdbc.queryList(FN_WORK_ORDER_ITEMS_BY_ORDER, ITEM_MAPPER, workOrderId);
    }

    @Override
    public List<WorkOrderTimelineEntryDto> findHistoryByOrderId(Long workOrderId) {
        return jdbc.queryList(FN_WORK_ORDER_HISTORY, HISTORY_MAPPER, workOrderId);
    }

    private static LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp != null ? timestamp.toLocalDateTime() : null;
    }
}

package com.gestaooficina.repository.jdbc;

import com.gestaooficina.model.dto.CustomerMeSummaryDto;
import com.gestaooficina.model.dto.VehicleDto;
import com.gestaooficina.model.dto.WorkOrderSummaryDto;
import com.gestaooficina.repository.CustomerMeRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class CustomerMeJdbcRepository implements CustomerMeRepository {

    private static final String FN_VEHICLES_COUNT = "SELECT fn_customer_me_vehicles_count(?)";
    private static final String FN_VEHICLES = "SELECT * FROM fn_customer_me_vehicles(?, ?, ?)";
    private static final String FN_ORDERS_COUNT = "SELECT fn_customer_me_orders_count(?, ?, ?)";
    private static final String FN_ORDERS = "SELECT * FROM fn_customer_me_orders(?, ?, ?, ?, ?)";
    private static final String FN_SUMMARY = "SELECT * FROM fn_customer_me_summary(?)";

    private static final RowMapper<VehicleDto> VEHICLE_MAPPER = (rs, rowNum) -> {
        VehicleDto dto = new VehicleDto();
        dto.setId(rs.getLong("id"));
        dto.setPlate(rs.getString("plate"));
        dto.setBrand(rs.getString("brand"));
        dto.setModel(rs.getString("model"));
        dto.setYear(rs.getObject("year", Integer.class));
        dto.setActive(rs.getBoolean("active"));
        dto.setCreatedAt(toLocalDateTime(rs.getTimestamp("created_at")));
        dto.setOrderCount(rs.getLong("order_count"));
        dto.setLastOrderNumber(rs.getString("last_order_number"));
        dto.setLastOrderAt(toLocalDateTime(rs.getTimestamp("last_order_at")));
        return dto;
    };

    private static final RowMapper<WorkOrderSummaryDto> ORDER_MAPPER = (rs, rowNum) -> {
        WorkOrderSummaryDto dto = new WorkOrderSummaryDto();
        dto.setId(rs.getLong("id"));
        dto.setNumber(rs.getString("number"));
        dto.setVehicleId(rs.getLong("vehicle_id"));
        dto.setVehiclePlate(rs.getString("vehicle_plate"));
        dto.setVehicleBrand(rs.getString("vehicle_brand"));
        dto.setVehicleModel(rs.getString("vehicle_model"));
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

    private static final RowMapper<CustomerMeSummaryDto> SUMMARY_MAPPER = (rs, rowNum) ->
            new CustomerMeSummaryDto(
                    rs.getLong("vehicle_count"),
                    rs.getLong("active_order_count"),
                    rs.getLong("history_order_count"),
                    rs.getLong("total_order_count"));

    private final JdbcProcedureExecutor jdbc;

    public CustomerMeJdbcRepository(JdbcProcedureExecutor jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public long countVehicles(Long customerId) {
        return jdbc.queryOne(FN_VEHICLES_COUNT, (rs, rowNum) -> rs.getLong(1), customerId)
                .orElse(0L);
    }

    @Override
    public List<VehicleDto> findVehicles(Long customerId, int page, int pageSize) {
        return jdbc.queryList(FN_VEHICLES, VEHICLE_MAPPER, customerId, page, pageSize);
    }

    @Override
    public long countOrders(Long customerId, String statusGroup, Long vehicleId) {
        return jdbc.queryOne(
                        FN_ORDERS_COUNT, (rs, rowNum) -> rs.getLong(1), customerId, statusGroup, vehicleId)
                .orElse(0L);
    }

    @Override
    public List<WorkOrderSummaryDto> findOrders(Long customerId, String statusGroup, Long vehicleId,
                                                int page, int pageSize) {
        return jdbc.queryList(
                FN_ORDERS, ORDER_MAPPER, customerId, statusGroup, vehicleId, page, pageSize);
    }

    @Override
    public Optional<CustomerMeSummaryDto> findSummary(Long customerId) {
        return jdbc.queryOne(FN_SUMMARY, SUMMARY_MAPPER, customerId);
    }

    private static LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp != null ? timestamp.toLocalDateTime() : null;
    }
}

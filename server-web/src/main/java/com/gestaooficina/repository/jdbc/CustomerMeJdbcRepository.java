package com.gestaooficina.repository.jdbc;

import com.gestaooficina.model.dto.VehicleDto;
import com.gestaooficina.model.dto.WorkOrderSummaryDto;
import com.gestaooficina.repository.CustomerMeRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class CustomerMeJdbcRepository implements CustomerMeRepository {

    private static final String FN_CUSTOMER_ME_VEHICLES =
            "SELECT * FROM fn_customer_me_vehicles(?)";

    private static final String FN_CUSTOMER_ME_ORDERS =
            "SELECT * FROM fn_customer_me_orders(?)";

    private static final RowMapper<VehicleDto> VEHICLE_MAPPER = (rs, rowNum) -> {
        VehicleDto dto = new VehicleDto();
        dto.setId(rs.getLong("id"));
        dto.setPlate(rs.getString("plate"));
        dto.setBrand(rs.getString("brand"));
        dto.setModel(rs.getString("model"));
        dto.setYear(rs.getObject("year", Integer.class));
        dto.setActive(rs.getBoolean("active"));
        dto.setCreatedAt(toLocalDateTime(rs.getTimestamp("created_at")));
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

    private final JdbcProcedureExecutor jdbc;

    public CustomerMeJdbcRepository(JdbcProcedureExecutor jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<VehicleDto> findVehiclesByCustomerId(Long customerId) {
        return jdbc.queryList(FN_CUSTOMER_ME_VEHICLES, VEHICLE_MAPPER, customerId);
    }

    @Override
    public List<WorkOrderSummaryDto> findOrdersByCustomerId(Long customerId) {
        return jdbc.queryList(FN_CUSTOMER_ME_ORDERS, ORDER_MAPPER, customerId);
    }

    private static LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp != null ? timestamp.toLocalDateTime() : null;
    }
}

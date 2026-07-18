package com.gestaooficina.repository.mapper;

import com.gestaooficina.model.record.CustomerRecord;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public final class CustomerRowMapper {

    private CustomerRowMapper() {
    }

    public static final RowMapper<CustomerRecord> INSTANCE = CustomerRowMapper::map;

    public static CustomerRecord map(ResultSet rs, int rowNum) throws SQLException {
        return new CustomerRecord(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("phone"),
                rs.getString("password"),
                rs.getBoolean("active"));
    }
}

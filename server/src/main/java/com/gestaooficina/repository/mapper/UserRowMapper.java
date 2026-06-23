package com.gestaooficina.repository.mapper;

import com.gestaooficina.model.enums.UserRoleEnum;
import com.gestaooficina.model.record.UserRecord;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public final class UserRowMapper {

    private UserRowMapper() {
    }

    public static final RowMapper<UserRecord> INSTANCE = UserRowMapper::map;

    public static UserRecord map(ResultSet rs, int rowNum) throws SQLException {
        return new UserRecord(
                rs.getLong("id"),
                rs.getString("email"),
                rs.getString("password"),
                rs.getString("name"),
                UserRoleEnum.fromCode(rs.getString("role")),
                rs.getBoolean("active"));
    }
}

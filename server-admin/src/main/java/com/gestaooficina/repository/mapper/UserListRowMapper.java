package com.gestaooficina.repository.mapper;

import com.gestaooficina.model.response.UserListItemResponse;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;

public final class UserListRowMapper {

    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private UserListRowMapper() {
    }

    public static final RowMapper<UserListItemResponse> LIST_ITEM = UserListRowMapper::mapListItem;

    public static UserListItemResponse mapListItem(ResultSet rs, int rowNum) throws SQLException {
        Timestamp createdAt = rs.getTimestamp("created_at");
        String formattedDate = createdAt != null
                ? createdAt.toLocalDateTime().format(DATE_TIME_FORMAT)
                : null;

        return new UserListItemResponse(
                rs.getLong("id"),
                rs.getString("email"),
                rs.getString("name"),
                rs.getString("role"),
                rs.getBoolean("active"),
                formattedDate);
    }
}

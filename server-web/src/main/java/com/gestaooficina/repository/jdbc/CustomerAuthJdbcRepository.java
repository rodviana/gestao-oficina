package com.gestaooficina.repository.jdbc;

import com.gestaooficina.model.dto.CustomerAccountDto;
import com.gestaooficina.repository.CustomerAuthRepository;
import com.gestaooficina.repository.jdbc.core.JdbcProcedureExecutor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class CustomerAuthJdbcRepository implements CustomerAuthRepository {

    private static final String FN_CUSTOMER_ACCOUNT_FIND_BY_LOGIN =
            "SELECT * FROM fn_customer_account_find_by_login(?)";

    private static final RowMapper<CustomerAccountDto> ROW_MAPPER = (rs, rowNum) -> new CustomerAccountDto(
            rs.getLong("account_id"),
            rs.getLong("customer_id"),
            rs.getString("name"),
            rs.getString("email"),
            rs.getString("phone"),
            rs.getString("password"),
            rs.getBoolean("active"));

    private final JdbcProcedureExecutor jdbc;

    public CustomerAuthJdbcRepository(JdbcProcedureExecutor jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Optional<CustomerAccountDto> findByLogin(String login) {
        return jdbc.queryOne(FN_CUSTOMER_ACCOUNT_FIND_BY_LOGIN, ROW_MAPPER, login);
    }
}

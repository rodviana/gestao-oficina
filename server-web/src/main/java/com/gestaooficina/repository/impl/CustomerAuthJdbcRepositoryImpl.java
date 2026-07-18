package com.gestaooficina.repository.impl;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.record.CustomerRecord;
import com.gestaooficina.repository.CustomerAuthJdbcRepository;
import com.gestaooficina.repository.filter.CustomerLoginFilter;
import com.gestaooficina.repository.mapper.CustomerRowMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CustomerAuthJdbcRepositoryImpl implements CustomerAuthJdbcRepository {

    private static final Logger log = LoggerFactory.getLogger(CustomerAuthJdbcRepositoryImpl.class);

    private final NamedParameterJdbcTemplate jdbc;

    public CustomerAuthJdbcRepositoryImpl(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Optional<CustomerRecord> findByLogin(CustomerLoginFilter filter) {
        String login = filter.getLogin();
        MapSqlParameterSource params = new MapSqlParameterSource("login", login);
        try {
            log.info("[web-auth] exec p_find_customer_by_login login={}", login);
            List<CustomerRecord> rows = jdbc.query(P_FIND_CUSTOMER_BY_LOGIN, params, CustomerRowMapper.INSTANCE);
            return rows.stream().findFirst();
        } catch (DataAccessException e) {
            log.error("[web-auth] JDBC error login={}: {}", login, e.getMessage(), e);
            throw GlobalException.of(ValidationMessageEnum.FAILED_LOAD_CUSTOMER);
        }
    }
}

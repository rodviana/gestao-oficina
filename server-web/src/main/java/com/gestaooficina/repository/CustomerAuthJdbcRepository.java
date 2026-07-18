package com.gestaooficina.repository;

import com.gestaooficina.model.record.CustomerRecord;
import com.gestaooficina.repository.filter.CustomerLoginFilter;

import java.util.Optional;

public interface CustomerAuthJdbcRepository {

    String P_FIND_CUSTOMER_BY_LOGIN = "SELECT * FROM p_find_customer_by_login(:login)";

    Optional<CustomerRecord> findByLogin(CustomerLoginFilter filter);
}

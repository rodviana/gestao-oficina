package com.gestaooficina.repository;

import com.gestaooficina.model.response.CreateUserResponse;
import com.gestaooficina.repository.filter.CreateUserFilter;

public interface UserJdbcRepository {

    String P_CREATE_USER = "SELECT * FROM p_create_user(:email, :password, :name, :role)";

    CreateUserResponse create(CreateUserFilter filter);
}

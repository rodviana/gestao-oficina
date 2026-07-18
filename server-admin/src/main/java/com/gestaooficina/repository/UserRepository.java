package com.gestaooficina.repository;

import com.gestaooficina.model.response.CreateUserResponse;

public interface UserRepository {

    CreateUserResponse create(String email, String encodedPassword, String name, String roleCode);
}

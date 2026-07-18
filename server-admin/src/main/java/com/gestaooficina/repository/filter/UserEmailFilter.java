package com.gestaooficina.repository.filter;

import com.gestaooficina.model.request.LoginRequest;

public class UserEmailFilter {

    private String email;

    public UserEmailFilter(String email) {
        this.email = email;
    }

    public UserEmailFilter(LoginRequest request) {
        this.email = request.getEmail().trim();
    }

    public String getEmail() {
        return email;
    }
}

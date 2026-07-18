package com.gestaooficina.repository.filter;

import com.gestaooficina.model.request.CreateUserRequest;

public class CreateUserFilter {

    private final String email;
    private final String encodedPassword;
    private final String name;
    private final String roleDbValue;

    public CreateUserFilter(CreateUserRequest request, String encodedPassword, String roleDbValue) {
        this.email = request.getEmail().trim();
        this.encodedPassword = encodedPassword;
        this.name = request.getName().trim();
        this.roleDbValue = roleDbValue;
    }

    public String getEmail() {
        return email;
    }

    public String getEncodedPassword() {
        return encodedPassword;
    }

    public String getName() {
        return name;
    }

    public String getRoleDbValue() {
        return roleDbValue;
    }
}

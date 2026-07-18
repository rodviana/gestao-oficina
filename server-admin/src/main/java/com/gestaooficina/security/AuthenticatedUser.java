package com.gestaooficina.security;

import com.gestaooficina.model.enums.UserRoleEnum;

public class AuthenticatedUser {

    private final Long id;
    private final String email;
    private final String name;
    private final String role;

    public AuthenticatedUser(Long id, String email, String name, String role) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public boolean isAdmin() {
        try {
            return UserRoleEnum.fromCode(role).isAdmin();
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}

package com.gestaooficina.model.record;

import com.gestaooficina.model.enums.UserRoleEnum;

public class UserRecord {

    private final Long id;
    private final String email;
    private final String password;
    private final String name;
    private final String role;
    private final boolean active;

    public UserRecord(Long id, String email, String password, String name, String role, boolean active) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    public boolean isAdmin() {
        try {
            return UserRoleEnum.fromCode(role).isAdmin();
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}

package com.gestaooficina.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserListItemResponse {

    private final Long id;
    private final String email;
    private final String name;
    private final String role;
    private final boolean active;
    private final String createdAt;

    public UserListItemResponse(Long id, String email, String name, String role, boolean active, String createdAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
    }

    @JsonProperty("id")
    public Long getId() {
        return id;
    }

    @JsonProperty("email")
    public String getEmail() {
        return email;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }

    @JsonProperty("role")
    public String getRole() {
        return role;
    }

    @JsonProperty("active")
    public boolean isActive() {
        return active;
    }

    @JsonProperty("createdAt")
    public String getCreatedAt() {
        return createdAt;
    }
}

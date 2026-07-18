package com.gestaooficina.model.response;

public class HomeResponse {

    private final Long id;
    private final String name;
    private final String email;
    private final String role;
    private final String message;

    public HomeResponse(Long id, String name, String email, String role, String message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }
}

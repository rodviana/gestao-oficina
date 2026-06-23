package com.gestaooficina.model.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User registration payload")
public class CreateUserRequest {

    private String name;

    private String email;

    private String password;

    @Schema(description = "ATTENDANT or MECHANIC", example = "ATTENDANT", allowableValues = {"ATTENDANT", "MECHANIC"})
    private String role;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

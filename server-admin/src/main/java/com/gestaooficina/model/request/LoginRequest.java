package com.gestaooficina.model.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Login credentials")
public class LoginRequest {

    @Schema(example = "admin@oficina.com")
    private String email;

    @Schema(example = "admin123")
    private String password;

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
}

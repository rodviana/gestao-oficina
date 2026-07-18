package com.gestaooficina.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Customer portal login credentials (email or phone)")
public class WebLoginRequest {

    @Schema(example = "roberto@email.com", description = "Email or phone")
    private String login;

    @Schema(example = "123456")
    private String password;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

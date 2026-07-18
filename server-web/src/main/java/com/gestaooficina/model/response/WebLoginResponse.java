package com.gestaooficina.model.response;

public class WebLoginResponse {

    private final String token;
    private final Long customerId;
    private final String name;
    private final String email;
    private final String phone;

    public WebLoginResponse(String token, Long customerId, String name, String email, String phone) {
        this.token = token;
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    public String getToken() {
        return token;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }
}

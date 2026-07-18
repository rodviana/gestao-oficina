package com.gestaooficina.model.dto;

public class CustomerAccountDto {

    private final Long accountId;
    private final Long customerId;
    private final String name;
    private final String email;
    private final String phone;
    private final String password;
    private final boolean active;

    public CustomerAccountDto(Long accountId, Long customerId, String name, String email,
                              String phone, String password, boolean active) {
        this.accountId = accountId;
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.active = active;
    }

    public Long getAccountId() {
        return accountId;
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

    public String getPassword() {
        return password;
    }

    public boolean isActive() {
        return active;
    }
}

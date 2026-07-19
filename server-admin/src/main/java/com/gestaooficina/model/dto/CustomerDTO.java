package com.gestaooficina.model.dto;

import java.time.Instant;

public class CustomerDTO {

    private Long id;
    private String name;
    private String document;
    private String phone;
    private Boolean active;
    private Instant createdAt;
    private Boolean hasAccount;
    private Long vehicleCount;

    public CustomerDTO() {
    }

    public CustomerDTO(Long id, String name, String document, String phone, Boolean active,
                       Instant createdAt, Boolean hasAccount, Long vehicleCount) {
        this.id = id;
        this.name = name;
        this.document = document;
        this.phone = phone;
        this.active = active;
        this.createdAt = createdAt;
        this.hasAccount = hasAccount;
        this.vehicleCount = vehicleCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDocument() {
        return document;
    }

    public void setDocument(String document) {
        this.document = document;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getHasAccount() {
        return hasAccount;
    }

    public void setHasAccount(Boolean hasAccount) {
        this.hasAccount = hasAccount;
    }

    public Long getVehicleCount() {
        return vehicleCount;
    }

    public void setVehicleCount(Long vehicleCount) {
        this.vehicleCount = vehicleCount;
    }
}

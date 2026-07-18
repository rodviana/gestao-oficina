package com.gestaooficina.model.dto;

import java.time.Instant;

public class VehicleDTO {

    private Long id;
    private Long customerId;
    private String customerName;
    private String plate;
    private String brand;
    private String model;
    private Integer year;
    private Boolean active;
    private Instant createdAt;

    public VehicleDTO() {
    }

    public VehicleDTO(Long id, Long customerId, String customerName, String plate, String brand,
                      String model, Integer year, Boolean active, Instant createdAt) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.plate = plate;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
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
}

package com.gestaooficina.model.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class ServiceCatalogDTO {

    private Long id;
    private String name;
    private BigDecimal defaultPrice;
    private Boolean active;
    private Instant createdAt;

    public ServiceCatalogDTO() {
    }

    public ServiceCatalogDTO(Long id, String name, BigDecimal defaultPrice, Boolean active, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.defaultPrice = defaultPrice;
        this.active = active;
        this.createdAt = createdAt;
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

    public BigDecimal getDefaultPrice() {
        return defaultPrice;
    }

    public void setDefaultPrice(BigDecimal defaultPrice) {
        this.defaultPrice = defaultPrice;
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

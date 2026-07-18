package com.gestaooficina.model.dto;

import java.math.BigDecimal;

public class UpdateWorkOrderItemRequest {

    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private String description;

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

package com.gestaooficina.model.dto;

public class UpdateWorkOrderPaymentRequest {

    private String paymentStatusCode;

    public String getPaymentStatusCode() {
        return paymentStatusCode;
    }

    public void setPaymentStatusCode(String paymentStatusCode) {
        this.paymentStatusCode = paymentStatusCode;
    }
}

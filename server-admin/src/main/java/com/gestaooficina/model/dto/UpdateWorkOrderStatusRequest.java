package com.gestaooficina.model.dto;

public class UpdateWorkOrderStatusRequest {

    private String statusCode;
    private String note;

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

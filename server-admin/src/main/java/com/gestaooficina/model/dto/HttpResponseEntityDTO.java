package com.gestaooficina.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class HttpResponseEntityDTO<T> {

    private boolean success;
    private String message;
    private T data;
    private int status;

    public HttpResponseEntityDTO() {
    }

    public HttpResponseEntityDTO(boolean success, T data, String message, int status) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.status = status;
    }

    public static <T> HttpResponseEntityDTO<T> ok(T data) {
        return new HttpResponseEntityDTO<>(true, data, "OK", 200);
    }

    public static <T> HttpResponseEntityDTO<T> ok(T data, String message) {
        return new HttpResponseEntityDTO<>(true, data, message, 200);
    }

    public static <T> HttpResponseEntityDTO<T> created(T data, String message) {
        return new HttpResponseEntityDTO<>(true, data, message, 201);
    }

    public static <T> HttpResponseEntityDTO<T> error(String message, int status) {
        return new HttpResponseEntityDTO<>(false, null, message, status);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}

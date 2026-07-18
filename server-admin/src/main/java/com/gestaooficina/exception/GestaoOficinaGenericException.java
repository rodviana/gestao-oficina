package com.gestaooficina.exception;

public class GestaoOficinaGenericException extends RuntimeException {

    public GestaoOficinaGenericException(String message) {
        super(message);
    }

    public GestaoOficinaGenericException(String message, Throwable cause) {
        super(message, cause);
    }
}

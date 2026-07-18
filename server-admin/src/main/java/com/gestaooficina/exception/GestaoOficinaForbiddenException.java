package com.gestaooficina.exception;

public class GestaoOficinaForbiddenException extends GestaoOficinaGenericException {

    public GestaoOficinaForbiddenException(String message) {
        super(message);
    }

    public GestaoOficinaForbiddenException(String message, Throwable cause) {
        super(message, cause);
    }
}

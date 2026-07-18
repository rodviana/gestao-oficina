package com.gestaooficina.controller;

import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

public abstract class BaseController {

    private static final Logger log = LoggerFactory.getLogger(BaseController.class);

    protected <T> ResponseEntity<HttpResponseEntityDTO<?>> ok(T data, String message) {
        HttpResponseEntityDTO<T> response = new HttpResponseEntityDTO<>();
        response.setSuccess(true);
        response.setStatus(HttpStatus.OK.value());
        response.setMessage(message);
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    protected <T> ResponseEntity<HttpResponseEntityDTO<?>> okList(List<T> dataList, String message) {
        HttpResponseEntityDTO<T> response = new HttpResponseEntityDTO<>();
        response.setSuccess(true);
        response.setStatus(HttpStatus.OK.value());
        response.setMessage(message);
        response.setDataList(dataList);
        return ResponseEntity.ok(response);
    }

    protected <T> ResponseEntity<HttpResponseEntityDTO<?>> created(T data, String message) {
        HttpResponseEntityDTO<T> response = new HttpResponseEntityDTO<>();
        response.setSuccess(true);
        response.setStatus(HttpStatus.CREATED.value());
        response.setMessage(message);
        response.setData(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    protected ResponseEntity<HttpResponseEntityDTO<?>> forbidden(String message) {
        log.warn("[gestao-oficina-web] forbidden: {}", message);
        return errorResponse(message, HttpStatus.FORBIDDEN);
    }

    protected ResponseEntity<HttpResponseEntityDTO<?>> forbidden(GestaoOficinaForbiddenException exception) {
        return forbidden(exception.getMessage());
    }

    protected ResponseEntity<HttpResponseEntityDTO<?>> genericError(GestaoOficinaGenericException exception) {
        log.warn("[gestao-oficina-web] business error: {}", exception.getMessage());
        return errorResponse(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    protected ResponseEntity<HttpResponseEntityDTO<?>> internalError(Exception exception, String message) {
        log.error("[gestao-oficina-web] internal error: {}", exception.getMessage(), exception);
        return errorResponse(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    protected Long requireCustomerId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new GestaoOficinaForbiddenException("Não autorizado.");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof Long) {
            return (Long) principal;
        }
        if (principal instanceof Number) {
            return ((Number) principal).longValue();
        }
        throw new GestaoOficinaForbiddenException("Não autorizado.");
    }

    private ResponseEntity<HttpResponseEntityDTO<?>> errorResponse(String message, HttpStatus status) {
        HttpResponseEntityDTO<?> dto = new HttpResponseEntityDTO<>();
        dto.setSuccess(false);
        dto.setStatus(status.value());
        dto.setMessage(message);
        return ResponseEntity.status(status).body(dto);
    }
}

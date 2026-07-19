package com.gestaooficina.controller;

import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.security.AuthenticatedUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

public abstract class BaseController {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    protected AuthenticatedUser requireUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser) {
            return (AuthenticatedUser) authentication.getPrincipal();
        }
        throw new GestaoOficinaForbiddenException("Não autorizado.");
    }

    protected String requireEmail(Authentication authentication) {
        return requireUser(authentication).getEmail();
    }

    protected Long requireUserId(Authentication authentication) {
        return requireUser(authentication).getId();
    }

    protected <T> ResponseEntity<HttpResponseEntityDTO<?>> ok(T data) {
        return ResponseEntity.ok(HttpResponseEntityDTO.ok(data));
    }

    protected <T> ResponseEntity<HttpResponseEntityDTO<?>> ok(T data, String message) {
        return ResponseEntity.ok(HttpResponseEntityDTO.ok(data, message));
    }

    protected <T> ResponseEntity<HttpResponseEntityDTO<?>> created(T data, String message) {
        return ResponseEntity.status(HttpStatus.CREATED).body(HttpResponseEntityDTO.created(data, message));
    }

    protected ResponseEntity<HttpResponseEntityDTO<?>> forbidden(GestaoOficinaForbiddenException e) {
        log.warn("[gestao-oficina] 403 Forbidden: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(HttpResponseEntityDTO.error(e.getMessage(), HttpStatus.FORBIDDEN.value()));
    }

    protected ResponseEntity<HttpResponseEntityDTO<?>> genericError(GestaoOficinaGenericException e) {
        log.warn("[gestao-oficina] 400 Bad Request: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(HttpResponseEntityDTO.error(e.getMessage(), HttpStatus.BAD_REQUEST.value()));
    }

    protected ResponseEntity<HttpResponseEntityDTO<?>> internalError(Exception e) {
        String detail = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
        log.error("[gestao-oficina] 500 Internal Server Error: {} - {}", detail, e.getClass().getSimpleName(), e);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(HttpResponseEntityDTO.error(
                        "Erro inesperado. Tente novamente em instantes.",
                        HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
}

package com.gestaooficina.controller;

import com.gestaooficina.model.response.HttpResponseEntityDTO;
import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

public abstract class BaseController {

    private static final Logger log = LoggerFactory.getLogger(BaseController.class);

    protected boolean canResolveUser(Authentication authentication) {
        return authentication != null
                && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof String
                && !((String) authentication.getPrincipal()).isBlank();
    }

    protected void validateAuthenticatedUser(Authentication authentication) {
        if (!canResolveUser(authentication)) {
            throw GlobalException.of(ValidationMessageEnum.UNAUTHORIZED);
        }
    }

    protected String requireEmail(Authentication authentication) {
        validateAuthenticatedUser(authentication);
        return (String) authentication.getPrincipal();
    }

    protected ResponseEntity<HttpResponseEntityDTO<?>> badRequest(GlobalException exception) {
        log.warn("[gestao-oficina] business error message={}", exception.getMessage());
        String message = exception.getMessage() != null
                ? exception.getMessage()
                : ValidationMessageEnum.INVALID_REQUEST.getDescriptionPt();
        return errorResponse(message, HttpStatus.BAD_REQUEST, exception.getErrors());
    }

    protected ResponseEntity<HttpResponseEntityDTO<?>> internalServerError(Exception e, ValidationMessageEnum message) {
        log.error("[internalServerError] {}: {}", e.getClass().getSimpleName(), e.getMessage(), e);
        return errorResponse(message.getDescriptionPt(), HttpStatus.INTERNAL_SERVER_ERROR, null);
    }

    private ResponseEntity<HttpResponseEntityDTO<?>> errorResponse(String message, HttpStatus status,
                                                                    List<String> errors) {
        HttpResponseEntityDTO<?> dto = new HttpResponseEntityDTO<>();
        dto.setSuccess(false);
        dto.setStatus(status.value());
        dto.setMessage(message);
        if (errors != null && !errors.isEmpty()) {
            dto.setErrors(errors);
        }
        return ResponseEntity.status(status).body(dto);
    }
}

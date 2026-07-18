package com.gestaooficina.exception;

import com.gestaooficina.model.enums.ValidationMessageEnum;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Business and validation errors exposed to the client as HTTP 400.
 * User-facing text uses {@link ValidationMessageEnum#getDescriptionPt()}.
 */
public class GlobalException extends RuntimeException {

    private final List<String> errors;

    private GlobalException(String message) {
        super(message);
        this.errors = Collections.emptyList();
    }

    private GlobalException(String message, List<String> errors) {
        super(message);
        this.errors = errors != null ? List.copyOf(errors) : Collections.emptyList();
    }

    public List<String> getErrors() {
        return errors;
    }

    public static GlobalException of(ValidationMessageEnum message) {
        return new GlobalException(message.getDescriptionPt());
    }

    public static GlobalException of(ValidationMessageEnum message, List<ValidationMessageEnum> errorMessages) {
        List<String> errors = errorMessages.stream()
                .map(ValidationMessageEnum::getDescriptionPt)
                .collect(Collectors.toList());
        return new GlobalException(message.getDescriptionPt(), errors);
    }
}

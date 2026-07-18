package com.gestaooficina.model.enums;

public enum ValidationMessageEnum {

    LOGIN_ID_REQUIRED("LOGIN_ID_REQUIRED", "Informe e-mail ou telefone.", "Email or phone is required."),
    PASSWORD_REQUIRED("PASSWORD_REQUIRED", "Senha é obrigatória.", "Password is required."),
    INVALID_CUSTOMER_CREDENTIALS("INVALID_CUSTOMER_CREDENTIALS",
            "E-mail/telefone ou senha incorretos.",
            "Incorrect email/phone or password."),

    UNAUTHORIZED("UNAUTHORIZED", "Não autorizado.", "Unauthorized."),
    ACCESS_DENIED("ACCESS_DENIED", "Acesso negado.", "Access denied."),

    FAILED_LOAD_CUSTOMER("FAILED_LOAD_CUSTOMER", "Falha ao carregar cliente.", "Failed to load customer."),
    INVALID_REQUEST("INVALID_REQUEST", "Requisição inválida.", "Invalid request."),

    UNEXPECTED_ERROR_LOGIN("UNEXPECTED_ERROR_LOGIN", "Erro inesperado ao fazer login.", "Unexpected error during login.");

    private final String code;
    private final String descriptionPt;
    private final String descriptionEng;

    ValidationMessageEnum(String code, String descriptionPt, String descriptionEng) {
        this.code = code;
        this.descriptionPt = descriptionPt;
        this.descriptionEng = descriptionEng;
    }

    public String getCode() {
        return code;
    }

    public String getDescriptionPt() {
        return descriptionPt;
    }

    public String getDescriptionEng() {
        return descriptionEng;
    }
}

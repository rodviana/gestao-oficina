package com.gestaooficina.model.enums;

public enum ValidationMessageEnum {

    EMAIL_REQUIRED("EMAIL_REQUIRED", "E-mail é obrigatório.", "Email is required."),
    INVALID_EMAIL("INVALID_EMAIL", "E-mail inválido.", "Invalid email."),
    PASSWORD_REQUIRED("PASSWORD_REQUIRED", "Senha é obrigatória.", "Password is required."),
    PASSWORD_MIN_LENGTH("PASSWORD_MIN_LENGTH", "Senha deve ter no mínimo 6 caracteres.", "Password must be at least 6 characters."),
    NAME_REQUIRED("NAME_REQUIRED", "Nome é obrigatório.", "Name is required."),
    NAME_MAX_LENGTH("NAME_MAX_LENGTH", "Nome deve ter no máximo 100 caracteres.", "Name must be at most 100 characters."),
    ROLE_REQUIRED("ROLE_REQUIRED", "Perfil é obrigatório.", "Role is required."),
    INVALID_PAGE_NUMBER("INVALID_PAGE_NUMBER", "Número de página inválido.", "Invalid page number."),
    PAGE_SIZE_MIN("PAGE_SIZE_MIN", "Tamanho da página deve ser maior que zero.", "Page size must be greater than zero."),
    PAGE_SIZE_MAX("PAGE_SIZE_MAX", "Tamanho máximo da página é 100.", "Maximum page size is 100."),
    INVALID_ROLE_FILTER("INVALID_ROLE_FILTER", "Filtro de perfil inválido.", "Invalid role filter."),
    INVALID_STATUS_FILTER("INVALID_STATUS_FILTER", "Filtro de status inválido.", "Invalid status filter."),
    INVALID_SEARCH_FIELD("INVALID_SEARCH_FIELD", "Campo de busca inválido.", "Invalid search field."),
    INVALID_DATA("INVALID_DATA", "Dados inválidos.", "Invalid data."),

    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "E-mail ou senha inválidos.", "Invalid email or password."),
    UNAUTHORIZED("UNAUTHORIZED", "Não autorizado.", "Unauthorized."),
    ACCESS_DENIED("ACCESS_DENIED", "Acesso negado.", "Access denied."),
    INVALID_ROLE("INVALID_ROLE", "Perfil inválido.", "Invalid role."),
    ADMIN_ROLE_NOT_ALLOWED("ADMIN_ROLE_NOT_ALLOWED",
            "O perfil ADMIN não pode ser criado por este endpoint.",
            "ADMIN role cannot be created through this endpoint."),
    EMAIL_ALREADY_REGISTERED("EMAIL_ALREADY_REGISTERED", "E-mail já cadastrado.", "Email already registered."),

    FAILED_LOAD_USER("FAILED_LOAD_USER", "Falha ao carregar usuário.", "Failed to load user."),
    FAILED_LOAD_USERS("FAILED_LOAD_USERS", "Falha ao carregar usuários.", "Failed to load users."),
    FAILED_CREATE_USER("FAILED_CREATE_USER", "Falha ao criar usuário.", "Failed to create user."),
    INVALID_REQUEST("INVALID_REQUEST", "Requisição inválida.", "Invalid request."),

    UNEXPECTED_ERROR_LOGIN("UNEXPECTED_ERROR_LOGIN", "Erro inesperado ao fazer login.", "Unexpected error during login."),
    UNEXPECTED_ERROR_HOME("UNEXPECTED_ERROR_HOME", "Erro inesperado ao carregar a tela inicial.", "Unexpected error loading home screen."),
    UNEXPECTED_ERROR_ADMIN_PANEL("UNEXPECTED_ERROR_ADMIN_PANEL", "Erro inesperado ao carregar o painel admin.", "Unexpected error loading admin panel."),
    UNEXPECTED_ERROR_USER_LIST("UNEXPECTED_ERROR_USER_LIST", "Erro inesperado ao carregar a lista de usuários.", "Unexpected error loading user list."),
    UNEXPECTED_ERROR_USER_CREATE("UNEXPECTED_ERROR_USER_CREATE", "Erro inesperado ao criar usuário.", "Unexpected error creating user.");

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

    public static ValidationMessageEnum fromCode(String code) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Unknown validation message code: " + code);
        }
        String normalized = code.trim().toUpperCase();
        for (ValidationMessageEnum message : values()) {
            if (message.code.equals(normalized)) {
                return message;
            }
        }
        throw new IllegalArgumentException("Unknown validation message code: " + code);
    }
}

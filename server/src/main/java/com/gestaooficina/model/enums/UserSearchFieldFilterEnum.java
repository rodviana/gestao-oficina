package com.gestaooficina.model.enums;

public enum UserSearchFieldFilterEnum {

    NAME("NAME", "Name"),
    EMAIL("EMAIL", "Email");

    private final String code;
    private final String description;

    UserSearchFieldFilterEnum(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static String normalize(String raw) {
        return fromCode(raw).getCode();
    }

    public static UserSearchFieldFilterEnum fromCode(String raw) {
        if (raw == null || raw.isBlank()) {
            return NAME;
        }
        String normalized = raw.trim().toUpperCase();
        for (UserSearchFieldFilterEnum field : values()) {
            if (field.code.equals(normalized)) {
                return field;
            }
        }
        throw new IllegalArgumentException("Invalid search field: " + raw);
    }
}

package com.gestaooficina.model.enums;

public enum UserActiveFilterEnum {

    ALL("ALL", "All users"),
    ACTIVE("ACTIVE", "Active users"),
    INACTIVE("INACTIVE", "Inactive users");

    private final String code;
    private final String description;

    UserActiveFilterEnum(String code, String description) {
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

    public static UserActiveFilterEnum fromCode(String raw) {
        if (raw == null || raw.isBlank()) {
            return ALL;
        }
        String normalized = raw.trim().toUpperCase();
        for (UserActiveFilterEnum filter : values()) {
            if (filter.code.equals(normalized)) {
                return filter;
            }
        }
        throw new IllegalArgumentException("Invalid active filter: " + raw);
    }
}

package com.gestaooficina.model.enums;

public enum UserRoleEnum {

    ADMIN("ADMIN", "Administrator"),
    ATTENDANT("ATTENDANT", "Attendant"),
    MECHANIC("MECHANIC", "Mechanic");

    private final String code;
    private final String description;

    UserRoleEnum(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static UserRoleEnum fromCode(String code) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Unknown user role: " + code);
        }
        String normalized = code.trim().toUpperCase();
        for (UserRoleEnum role : values()) {
            if (role.code.equals(normalized)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown user role: " + code);
    }

    public boolean isAdmin() {
        return this == ADMIN;
    }
}

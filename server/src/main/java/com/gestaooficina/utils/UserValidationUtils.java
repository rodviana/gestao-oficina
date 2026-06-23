package com.gestaooficina.utils;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.UserActiveFilterEnum;
import com.gestaooficina.model.enums.UserRoleEnum;
import com.gestaooficina.model.enums.UserSearchFieldFilterEnum;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.request.CreateUserRequest;
import com.gestaooficina.model.request.LoginRequest;

import java.util.regex.Pattern;

public final class UserValidationUtils {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private UserValidationUtils() {
    }

    public static void validateLoginRequest(LoginRequest request) {
        if (request == null) {
            throw GlobalException.of(ValidationMessageEnum.EMAIL_REQUIRED);
        }
        if (isBlank(request.getEmail())) {
            throw GlobalException.of(ValidationMessageEnum.EMAIL_REQUIRED);
        }
        if (!isValidEmail(request.getEmail())) {
            throw GlobalException.of(ValidationMessageEnum.INVALID_EMAIL);
        }
        if (isBlank(request.getPassword())) {
            throw GlobalException.of(ValidationMessageEnum.PASSWORD_REQUIRED);
        }
    }

    public static void validateCreateUserRequest(CreateUserRequest request) {
        if (request == null) {
            throw GlobalException.of(ValidationMessageEnum.NAME_REQUIRED);
        }
        if (isBlank(request.getName())) {
            throw GlobalException.of(ValidationMessageEnum.NAME_REQUIRED);
        }
        if (request.getName().trim().length() > 100) {
            throw GlobalException.of(ValidationMessageEnum.NAME_MAX_LENGTH);
        }
        if (isBlank(request.getEmail())) {
            throw GlobalException.of(ValidationMessageEnum.EMAIL_REQUIRED);
        }
        if (!isValidEmail(request.getEmail())) {
            throw GlobalException.of(ValidationMessageEnum.INVALID_EMAIL);
        }
        if (isBlank(request.getPassword())) {
            throw GlobalException.of(ValidationMessageEnum.PASSWORD_REQUIRED);
        }
        if (request.getPassword().length() < 6) {
            throw GlobalException.of(ValidationMessageEnum.PASSWORD_MIN_LENGTH);
        }
        if (isBlank(request.getRole())) {
            throw GlobalException.of(ValidationMessageEnum.ROLE_REQUIRED);
        }
    }

    public static void validatePagination(int pageNumber, int pageSize) {
        if (pageNumber < 0) {
            throw GlobalException.of(ValidationMessageEnum.INVALID_PAGE_NUMBER);
        }
        if (pageSize <= 0) {
            throw GlobalException.of(ValidationMessageEnum.PAGE_SIZE_MIN);
        }
        if (pageSize > 100) {
            throw GlobalException.of(ValidationMessageEnum.PAGE_SIZE_MAX);
        }
    }

    public static String normalizeRoleFilter(String role) {
        if (role == null || role.isBlank() || "ALL".equalsIgnoreCase(role.trim())) {
            return "ALL";
        }
        try {
            return UserRoleEnum.fromCode(role.trim()).getCode();
        } catch (IllegalArgumentException ex) {
            throw GlobalException.of(ValidationMessageEnum.INVALID_ROLE_FILTER);
        }
    }

    public static String normalizeActiveFilter(String activeFilter) {
        try {
            return UserActiveFilterEnum.normalize(activeFilter);
        } catch (IllegalArgumentException ex) {
            throw GlobalException.of(ValidationMessageEnum.INVALID_STATUS_FILTER);
        }
    }

    public static String normalizeSearchFieldFilter(String searchField) {
        try {
            return UserSearchFieldFilterEnum.normalize(searchField);
        } catch (IllegalArgumentException ex) {
            throw GlobalException.of(ValidationMessageEnum.INVALID_SEARCH_FIELD);
        }
    }

    public static String normalizeSearchText(String searchText) {
        if (searchText == null) {
            return null;
        }
        String trimmed = searchText.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }
}

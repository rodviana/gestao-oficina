package com.gestaooficina.utils;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.enums.UserActiveFilterEnum;
import com.gestaooficina.model.enums.UserRoleEnum;
import com.gestaooficina.model.enums.UserSearchFieldFilterEnum;
import com.gestaooficina.model.request.CreateUserRequest;
import com.gestaooficina.model.request.LoginRequest;
import org.springframework.dao.DataAccessException;

import java.util.regex.Pattern;

public final class UserValidationUtils {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private UserValidationUtils() {
    }

    public static void validateLoginRequest(LoginRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("E-mail é obrigatório.");
        }
        if (isBlank(request.getEmail())) {
            throw new GestaoOficinaGenericException("E-mail é obrigatório.");
        }
        if (!isValidEmail(request.getEmail())) {
            throw new GestaoOficinaGenericException("E-mail inválido.");
        }
        if (isBlank(request.getPassword())) {
            throw new GestaoOficinaGenericException("Senha é obrigatória.");
        }
    }

    public static void validateCreateUserRequest(CreateUserRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Nome é obrigatório.");
        }
        if (isBlank(request.getName())) {
            throw new GestaoOficinaGenericException("Nome é obrigatório.");
        }
        if (request.getName().trim().length() > 100) {
            throw new GestaoOficinaGenericException("Nome deve ter no máximo 100 caracteres.");
        }
        if (isBlank(request.getEmail())) {
            throw new GestaoOficinaGenericException("E-mail é obrigatório.");
        }
        if (!isValidEmail(request.getEmail())) {
            throw new GestaoOficinaGenericException("E-mail inválido.");
        }
        if (isBlank(request.getPassword())) {
            throw new GestaoOficinaGenericException("Senha é obrigatória.");
        }
        if (request.getPassword().length() < 6) {
            throw new GestaoOficinaGenericException("Senha deve ter no mínimo 6 caracteres.");
        }
        if (isBlank(request.getRole())) {
            throw new GestaoOficinaGenericException("Perfil é obrigatório.");
        }
    }

    public static void validatePagination(int pageNumber, int pageSize) {
        if (pageNumber < 0) {
            throw new GestaoOficinaGenericException("Número de página inválido.");
        }
        if (pageSize <= 0) {
            throw new GestaoOficinaGenericException("Tamanho da página deve ser maior que zero.");
        }
        if (pageSize > 100) {
            throw new GestaoOficinaGenericException("Tamanho máximo da página é 100.");
        }
    }

    public static String normalizeRoleFilter(String role) {
        if (role == null || role.isBlank() || "ALL".equalsIgnoreCase(role.trim())) {
            return "ALL";
        }
        try {
            return UserRoleEnum.fromCode(role.trim()).getCode();
        } catch (IllegalArgumentException ex) {
            throw new GestaoOficinaGenericException("Filtro de perfil inválido.");
        }
    }

    public static String normalizeActiveFilter(String activeFilter) {
        try {
            return UserActiveFilterEnum.normalize(activeFilter);
        } catch (IllegalArgumentException ex) {
            throw new GestaoOficinaGenericException("Filtro de status inválido.");
        }
    }

    public static String normalizeSearchFieldFilter(String searchField) {
        try {
            return UserSearchFieldFilterEnum.normalize(searchField);
        } catch (IllegalArgumentException ex) {
            throw new GestaoOficinaGenericException("Campo de busca inválido.");
        }
    }

    public static String normalizeSearchText(String searchText) {
        if (searchText == null) {
            return null;
        }
        String trimmed = searchText.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    public static void requireNonBlank(String value, String message) {
        if (isBlank(value)) {
            throw new GestaoOficinaGenericException(message);
        }
    }

    public static void requireValidEmail(String email, String message) {
        if (!isValidEmail(email)) {
            throw new GestaoOficinaGenericException(message);
        }
    }

    public static void requirePositiveId(Long id, String message) {
        if (id == null || id <= 0) {
            throw new GestaoOficinaGenericException(message);
        }
    }

    public static String jdbcErrorMessage(DataAccessException ex, String fallback) {
        if (ex.getMostSpecificCause() != null && ex.getMostSpecificCause().getMessage() != null) {
            String msg = ex.getMostSpecificCause().getMessage();
            if (msg.contains("ERROR:")) {
                int idx = msg.indexOf("ERROR:");
                return msg.substring(idx + 6).trim();
            }
            return msg.trim();
        }
        return fallback;
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }
}

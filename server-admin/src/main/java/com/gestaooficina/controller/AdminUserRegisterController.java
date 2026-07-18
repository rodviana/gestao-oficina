package com.gestaooficina.controller;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.model.request.CreateUserRequest;
import com.gestaooficina.model.response.CreateUserResponse;
import com.gestaooficina.service.AdminUserRegisterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaControllerMapping.ADMIN_PATH)
@Tag(name = "Admin User Register", description = "User registration screen (/admin/users/new)")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class AdminUserRegisterController extends BaseController {

    private final AdminUserRegisterService adminUserRegisterService;

    public AdminUserRegisterController(AdminUserRegisterService adminUserRegisterService) {
        this.adminUserRegisterService = adminUserRegisterService;
    }

    @PostMapping(GestaoOficinaControllerMapping.ADMIN_USERS)
    @Operation(summary = "Create user", description = "Creates an attendant or mechanic. ADMIN role required.")
    public ResponseEntity<HttpResponseEntityDTO<?>> createUser(
            Authentication authentication,
            @RequestBody CreateUserRequest request) {
        try {
            String email = requireEmail(authentication);
            CreateUserResponse data = adminUserRegisterService.createUser(email, request);
            log.info("[admin-user-register] created id={} email={}", data.getId(), data.getEmail());
            return created(data, "User created successfully.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }
}

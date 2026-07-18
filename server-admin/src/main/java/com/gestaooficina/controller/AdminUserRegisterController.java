package com.gestaooficina.controller;

import com.gestaooficina.controller.BaseController;
import com.gestaooficina.controller.GestaoOficinaControllerMapping;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.request.CreateUserRequest;
import com.gestaooficina.model.response.CreateUserResponse;
import com.gestaooficina.model.response.HttpResponseEntityDTO;
import com.gestaooficina.service.AdminUserRegisterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
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

    private static final Logger log = LoggerFactory.getLogger(AdminUserRegisterController.class);

    private final AdminUserRegisterService adminUserRegisterService;

    public AdminUserRegisterController(AdminUserRegisterService adminUserRegisterService) {
        this.adminUserRegisterService = adminUserRegisterService;
    }

    @PostMapping(GestaoOficinaControllerMapping.ADMIN_USERS)
    @Operation(summary = "Create user", description = "Creates an attendant or mechanic. ADMIN role required.")
    public ResponseEntity<HttpResponseEntityDTO<?>> createUser(
            Authentication authentication,
            @RequestBody CreateUserRequest request) {
        HttpResponseEntityDTO<CreateUserResponse> response = new HttpResponseEntityDTO<>();
        try {
            String email = requireEmail(authentication);
            CreateUserResponse data = adminUserRegisterService.createUser(email, request);
            log.info("[admin-user-register] created id={} email={}", data.getId(), data.getEmail());
            response.setData(data);
            response.setSuccess(true);
            response.setStatus(HttpStatus.CREATED.value());
            response.setMessage("User created successfully.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (GlobalException e) {
            return badRequest(e);
        } catch (Exception e) {
            return internalServerError(e, ValidationMessageEnum.UNEXPECTED_ERROR_USER_CREATE);
        }
    }
}

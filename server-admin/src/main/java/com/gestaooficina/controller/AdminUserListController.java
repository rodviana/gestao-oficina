package com.gestaooficina.controller;

import com.gestaooficina.controller.BaseController;
import com.gestaooficina.controller.GestaoOficinaControllerMapping;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.response.HttpResponseEntityDTO;
import com.gestaooficina.model.request.UserListRequest;
import com.gestaooficina.model.response.UserListResponse;
import com.gestaooficina.service.AdminUserListService;
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
@Tag(name = "Admin User List", description = "User list screen (/admin/users)")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class AdminUserListController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(AdminUserListController.class);

    private final AdminUserListService adminUserListService;

    public AdminUserListController(AdminUserListService adminUserListService) {
        this.adminUserListService = adminUserListService;
    }

    @PostMapping(GestaoOficinaControllerMapping.ADMIN_USERS_LIST)
    @Operation(summary = "List users", description = "Paginated list with filters.")
    public ResponseEntity<HttpResponseEntityDTO<?>> list(
            Authentication authentication,
            @RequestBody(required = false) UserListRequest request) {
        HttpResponseEntityDTO<UserListResponse> response = new HttpResponseEntityDTO<>();
        try {
            String email = requireEmail(authentication);
            UserListResponse data = adminUserListService.getList(email, request);
            log.info("[admin-user-list] OK count={} page={}", data.getTotalNumber(), data.getPageNumber());
            response.setData(data);
            response.setSuccess(true);
            response.setStatus(HttpStatus.OK.value());
            response.setMessage("User list loaded.");
            return ResponseEntity.ok(response);
        } catch (GlobalException e) {
            return badRequest(e);
        } catch (Exception e) {
            return internalServerError(e, ValidationMessageEnum.UNEXPECTED_ERROR_USER_LIST);
        }
    }
}

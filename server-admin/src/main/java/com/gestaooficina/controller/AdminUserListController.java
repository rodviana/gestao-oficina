package com.gestaooficina.controller;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.model.request.UserListRequest;
import com.gestaooficina.model.response.UserListResponse;
import com.gestaooficina.service.AdminUserListService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaControllerMapping.ADMIN_PATH)
@Tag(name = "Admin User List", description = "User list screen (/admin/users)")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class AdminUserListController extends BaseController {

    private final AdminUserListService adminUserListService;

    public AdminUserListController(AdminUserListService adminUserListService) {
        this.adminUserListService = adminUserListService;
    }

    @GetMapping(GestaoOficinaControllerMapping.ADMIN_USERS_LIST)
    @Operation(summary = "List users (GET)", description = "Paginated list with filters via query params in POST body alternative.")
    public ResponseEntity<HttpResponseEntityDTO<?>> listGet(Authentication authentication) {
        return list(authentication, null);
    }

    @PostMapping(GestaoOficinaControllerMapping.ADMIN_USERS_LIST)
    @Operation(summary = "List users", description = "Paginated list with filters.")
    public ResponseEntity<HttpResponseEntityDTO<?>> list(
            Authentication authentication,
            @RequestBody(required = false) UserListRequest request) {
        try {
            String email = requireEmail(authentication);
            UserListResponse data = adminUserListService.getList(email, request);
            log.info("[admin-user-list] OK count={} page={}", data.getTotalNumber(), data.getPageNumber());
            return ok(data, "User list loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }
}

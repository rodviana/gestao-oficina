package com.gestaooficina.controller;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.model.response.AdminPanelResponse;
import com.gestaooficina.service.AdminPanelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaControllerMapping.ADMIN_PATH)
@Tag(name = "Admin Panel", description = "Admin panel screen (/admin)")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class AdminPanelController extends BaseController {

    private final AdminPanelService adminPanelService;

    public AdminPanelController(AdminPanelService adminPanelService) {
        this.adminPanelService = adminPanelService;
    }

    @GetMapping(GestaoOficinaControllerMapping.ADMIN_PANEL)
    @Operation(summary = "Admin panel", description = "Welcome message for the admin panel.")
    public ResponseEntity<HttpResponseEntityDTO<?>> panel(Authentication authentication) {
        try {
            String email = requireEmail(authentication);
            AdminPanelResponse data = adminPanelService.getPanel(email);
            log.info("[admin-panel] OK email={}", email);
            return ok(data, "Admin panel loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }
}

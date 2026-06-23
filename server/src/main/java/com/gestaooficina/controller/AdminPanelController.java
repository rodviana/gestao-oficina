package com.gestaooficina.controller;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.response.AdminPanelResponse;
import com.gestaooficina.model.response.HttpResponseEntityDTO;
import com.gestaooficina.service.AdminPanelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
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

    private static final Logger log = LoggerFactory.getLogger(AdminPanelController.class);

    private final AdminPanelService adminPanelService;

    public AdminPanelController(AdminPanelService adminPanelService) {
        this.adminPanelService = adminPanelService;
    }

    @GetMapping(GestaoOficinaControllerMapping.ADMIN_PANEL)
    @Operation(summary = "Admin panel", description = "Welcome message for the admin panel.")
    public ResponseEntity<HttpResponseEntityDTO<?>> panel(Authentication authentication) {
        HttpResponseEntityDTO<AdminPanelResponse> response = new HttpResponseEntityDTO<>();
        try {
            String email = requireEmail(authentication);
            AdminPanelResponse data = adminPanelService.getPanel(email);
            log.info("[admin-panel] OK email={}", email);
            response.setData(data);
            response.setSuccess(true);
            response.setStatus(HttpStatus.OK.value());
            response.setMessage("Admin panel loaded.");
            return ResponseEntity.ok(response);
        } catch (GlobalException e) {
            return badRequest(e);
        } catch (Exception e) {
            return internalServerError(e, ValidationMessageEnum.UNEXPECTED_ERROR_ADMIN_PANEL);
        }
    }
}

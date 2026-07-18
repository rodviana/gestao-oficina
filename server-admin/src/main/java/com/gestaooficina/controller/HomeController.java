package com.gestaooficina.controller;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.model.response.HomeResponse;
import com.gestaooficina.service.HomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaControllerMapping.HOME_PATH)
@Tag(name = "Home", description = "Home screen (/)")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class HomeController extends BaseController {

    private final HomeService homeService;

    public HomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @GetMapping
    @Operation(summary = "Home data", description = "Returns authenticated user information.")
    public ResponseEntity<HttpResponseEntityDTO<?>> home(Authentication authentication) {
        try {
            String email = requireEmail(authentication);
            HomeResponse data = homeService.getHome(email);
            log.info("[home] OK email={}", email);
            return ok(data, "Home data loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }
}

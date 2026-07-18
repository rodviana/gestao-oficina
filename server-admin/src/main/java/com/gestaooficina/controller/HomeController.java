package com.gestaooficina.controller;

import com.gestaooficina.controller.BaseController;
import com.gestaooficina.controller.GestaoOficinaControllerMapping;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.response.HomeResponse;
import com.gestaooficina.model.response.HttpResponseEntityDTO;
import com.gestaooficina.service.HomeService;
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
@RequestMapping(GestaoOficinaControllerMapping.HOME_PATH)
@Tag(name = "Home", description = "Home screen (/)")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class HomeController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(HomeController.class);

    private final HomeService homeService;

    public HomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @GetMapping
    @Operation(summary = "Home data", description = "Returns authenticated user information.")
    public ResponseEntity<HttpResponseEntityDTO<?>> home(Authentication authentication) {
        HttpResponseEntityDTO<HomeResponse> response = new HttpResponseEntityDTO<>();
        try {
            String email = requireEmail(authentication);
            HomeResponse data = homeService.getHome(email);
            log.info("[home] OK email={}", email);
            response.setData(data);
            response.setSuccess(true);
            response.setStatus(HttpStatus.OK.value());
            response.setMessage("Home data loaded.");
            return ResponseEntity.ok(response);
        } catch (GlobalException e) {
            return badRequest(e);
        } catch (Exception e) {
            return internalServerError(e, ValidationMessageEnum.UNEXPECTED_ERROR_HOME);
        }
    }
}

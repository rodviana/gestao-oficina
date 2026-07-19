package com.gestaooficina.controller;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.model.dto.WebLoginRequest;
import com.gestaooficina.model.dto.WebLoginResponse;
import com.gestaooficina.service.WebLoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaWebControllerMapping.WEB_AUTH_PATH)
@Tag(name = "Web Login", description = "Customer portal login")
public class WebLoginController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(WebLoginController.class);

    private final WebLoginService webLoginService;

    public WebLoginController(WebLoginService webLoginService) {
        this.webLoginService = webLoginService;
    }

    @PostMapping(GestaoOficinaWebControllerMapping.AUTH_LOGIN)
    @Operation(summary = "Customer login",
            description = "Authenticates a customer with email or phone and password. Returns JWT.")
    public ResponseEntity<HttpResponseEntityDTO<?>> login(@RequestBody WebLoginRequest request) {
        try {
            WebLoginResponse data = webLoginService.login(request);
            log.info("[web-login] OK customerId={}", data.getCustomerId());
            return ok(data, "Login successful.");
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e, "Erro inesperado ao fazer login.");
        }
    }
}

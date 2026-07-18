package com.gestaooficina.controller;

import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.model.request.LoginRequest;
import com.gestaooficina.model.response.LoginResponse;
import com.gestaooficina.service.LoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaControllerMapping.AUTH_PATH)
@Tag(name = "Login", description = "Login screen (/login)")
public class LoginController extends BaseController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping(GestaoOficinaControllerMapping.AUTH_LOGIN)
    @Operation(summary = "Login", description = "Authenticates with email and password. Returns JWT for protected endpoints.")
    public ResponseEntity<HttpResponseEntityDTO<?>> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse data = loginService.login(request);
            log.info("[login] OK email={}", data.getEmail());
            return ok(data, "Login successful.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }
}

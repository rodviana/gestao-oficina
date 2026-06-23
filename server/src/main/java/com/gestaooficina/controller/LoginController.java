package com.gestaooficina.controller;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.response.HttpResponseEntityDTO;
import com.gestaooficina.model.request.LoginRequest;
import com.gestaooficina.model.response.LoginResponse;
import com.gestaooficina.service.LoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaControllerMapping.AUTH_PATH)
@Tag(name = "Login", description = "Login screen (/login)")
public class LoginController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(LoginController.class);

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping(GestaoOficinaControllerMapping.AUTH_LOGIN)
    @Operation(summary = "Login", description = "Authenticates with email and password. Returns JWT for protected endpoints.")
    public ResponseEntity<HttpResponseEntityDTO<?>> login(@RequestBody LoginRequest request) {
        HttpResponseEntityDTO<LoginResponse> response = new HttpResponseEntityDTO<>();
        try {
            LoginResponse data = loginService.login(request);
            log.info("[login] OK email={}", data.getEmail());
            response.setData(data);
            response.setSuccess(true);
            response.setStatus(HttpStatus.OK.value());
            response.setMessage("Login successful.");
            return ResponseEntity.ok(response);
        } catch (GlobalException e) {
            return badRequest(e);
        } catch (Exception e) {
            return internalServerError(e, ValidationMessageEnum.UNEXPECTED_ERROR_LOGIN);
        }
    }
}

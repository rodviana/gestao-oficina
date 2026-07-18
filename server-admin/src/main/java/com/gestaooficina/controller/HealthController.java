package com.gestaooficina.controller;

import com.gestaooficina.model.response.HttpResponseEntityDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(GestaoOficinaControllerMapping.HEALTH_PATH)
@Tag(name = "Health", description = "API availability check")
public class HealthController extends BaseController {

    @GetMapping
    @Operation(summary = "Health check", description = "Returns UP when the API is running.")
    public ResponseEntity<HttpResponseEntityDTO<?>> health() {
        HttpResponseEntityDTO<Map<String, String>> response = new HttpResponseEntityDTO<>();
        response.setSuccess(true);
        response.setStatus(HttpStatus.OK.value());
        response.setData(Map.of("status", "UP"));
        return ResponseEntity.ok(response);
    }
}

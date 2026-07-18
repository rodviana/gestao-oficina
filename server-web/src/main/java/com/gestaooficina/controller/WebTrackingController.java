package com.gestaooficina.controller;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.service.WebTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaWebControllerMapping.WEB_TRACKING_PATH)
@Tag(name = "Web Tracking", description = "Public work order lookup by number and plate")
public class WebTrackingController extends BaseController {

    private final WebTrackingService webTrackingService;

    public WebTrackingController(WebTrackingService webTrackingService) {
        this.webTrackingService = webTrackingService;
    }

    @GetMapping
    @Operation(summary = "Track work order",
            description = "Public lookup by OS number and vehicle plate. Returns order with items and timeline.")
    public ResponseEntity<HttpResponseEntityDTO<?>> track(@RequestParam String number,
                                                          @RequestParam String plate) {
        try {
            return ok(webTrackingService.track(number, plate), "Work order found.");
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e, "Erro inesperado ao consultar ordem de serviço.");
        }
    }
}

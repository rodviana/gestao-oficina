package com.gestaooficina.controller;

import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.service.WebMeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaWebControllerMapping.WEB_ME_PATH)
@Tag(name = "Web Me", description = "Authenticated customer portal data")
public class WebMeController extends BaseController {

    private final WebMeService webMeService;

    public WebMeController(WebMeService webMeService) {
        this.webMeService = webMeService;
    }

    @GetMapping(GestaoOficinaWebControllerMapping.ME_ORDERS)
    @Operation(summary = "List customer work orders (paginated)")
    public ResponseEntity<HttpResponseEntityDTO<?>> listOrders(
            Authentication authentication,
            @RequestParam(required = false) String statusGroup,
            @RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        try {
            Long customerId = requireCustomerId(authentication);
            return ok(
                    webMeService.getOrders(customerId, statusGroup, vehicleId, page, pageSize),
                    "Orders loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e, "Erro inesperado ao carregar ordens de serviço.");
        }
    }

    @GetMapping(GestaoOficinaWebControllerMapping.ME_VEHICLES)
    @Operation(summary = "List customer vehicles (paginated)")
    public ResponseEntity<HttpResponseEntityDTO<?>> listVehicles(
            Authentication authentication,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        try {
            Long customerId = requireCustomerId(authentication);
            return ok(webMeService.getVehicles(customerId, page, pageSize), "Vehicles loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e, "Erro inesperado ao carregar veículos.");
        }
    }

    @GetMapping(GestaoOficinaWebControllerMapping.ME_SUMMARY)
    @Operation(summary = "Customer portfolio summary counters")
    public ResponseEntity<HttpResponseEntityDTO<?>> summary(Authentication authentication) {
        try {
            Long customerId = requireCustomerId(authentication);
            return ok(webMeService.getSummary(customerId), "Summary loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e, "Erro inesperado ao carregar resumo.");
        }
    }

    @GetMapping(GestaoOficinaWebControllerMapping.ME_ORDER_BY_ID)
    @Operation(summary = "Get work order detail for authenticated customer")
    public ResponseEntity<HttpResponseEntityDTO<?>> getOrderById(@PathVariable Long id,
                                                                 Authentication authentication) {
        try {
            Long customerId = requireCustomerId(authentication);
            return ok(webMeService.getOrderById(customerId, id), "Order loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e, "Erro inesperado ao carregar ordem de serviço.");
        }
    }
}

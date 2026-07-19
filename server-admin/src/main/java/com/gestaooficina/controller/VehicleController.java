package com.gestaooficina.controller;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.CreateVehicleRequest;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.model.dto.UpdateVehicleRequest;
import com.gestaooficina.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaControllerMapping.VEHICLES_PATH)
@Tag(name = "Vehicles", description = "Vehicle management")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class VehicleController extends BaseController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @Operation(summary = "List vehicles")
    public ResponseEntity<HttpResponseEntityDTO<?>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        try {
            return ok(vehicleService.search(search, page, pageSize), "Vehicles loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle by id")
    public ResponseEntity<HttpResponseEntityDTO<?>> getById(@PathVariable Long id) {
        try {
            return ok(vehicleService.findById(id), "Vehicle loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @GetMapping(GestaoOficinaControllerMapping.VEHICLES_BY_PLATE)
    @Operation(summary = "Find vehicle by plate")
    public ResponseEntity<HttpResponseEntityDTO<?>> findByPlate(@RequestParam String plate) {
        try {
            return ok(vehicleService.findByPlate(plate), "Vehicle loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @GetMapping(GestaoOficinaControllerMapping.VEHICLES_BY_CUSTOMER + "/{customerId}")
    @Operation(summary = "List vehicles by customer")
    public ResponseEntity<HttpResponseEntityDTO<?>> findByCustomer(
            @PathVariable Long customerId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        try {
            return ok(vehicleService.findByCustomer(customerId, page, pageSize), "Vehicles loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Work order history by vehicle")
    public ResponseEntity<HttpResponseEntityDTO<?>> history(
            @PathVariable Long id,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        try {
            return ok(vehicleService.findHistory(id, page, pageSize), "Vehicle history loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PostMapping
    @Operation(summary = "Create vehicle")
    public ResponseEntity<HttpResponseEntityDTO<?>> create(@RequestBody CreateVehicleRequest request) {
        try {
            return created(vehicleService.create(request), "Vehicle created.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vehicle")
    public ResponseEntity<HttpResponseEntityDTO<?>> update(
            @PathVariable Long id,
            @RequestBody UpdateVehicleRequest request) {
        try {
            return ok(vehicleService.update(id, request), "Vehicle updated.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }
}

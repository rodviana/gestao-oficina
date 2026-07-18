package com.gestaooficina.controller;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.CreateCustomerRequest;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.model.dto.UpdateCustomerRequest;
import com.gestaooficina.service.CustomerService;
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
@RequestMapping(GestaoOficinaControllerMapping.CUSTOMERS_PATH)
@Tag(name = "Customers", description = "Customer management")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class CustomerController extends BaseController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @Operation(summary = "List customers")
    public ResponseEntity<HttpResponseEntityDTO<?>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        try {
            return ok(customerService.search(search, page, pageSize), "Customers loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by id")
    public ResponseEntity<HttpResponseEntityDTO<?>> getById(@PathVariable Long id) {
        try {
            return ok(customerService.findById(id), "Customer loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @GetMapping(GestaoOficinaControllerMapping.CUSTOMERS_BY_PHONE)
    @Operation(summary = "Find customers by phone")
    public ResponseEntity<HttpResponseEntityDTO<?>> findByPhone(@RequestParam String phone) {
        try {
            return ok(customerService.findByPhone(phone), "Customers loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PostMapping
    @Operation(summary = "Create customer")
    public ResponseEntity<HttpResponseEntityDTO<?>> create(@RequestBody CreateCustomerRequest request) {
        try {
            return created(customerService.create(request), "Customer created.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer")
    public ResponseEntity<HttpResponseEntityDTO<?>> update(
            @PathVariable Long id,
            @RequestBody UpdateCustomerRequest request) {
        try {
            return ok(customerService.update(id, request), "Customer updated.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }
}

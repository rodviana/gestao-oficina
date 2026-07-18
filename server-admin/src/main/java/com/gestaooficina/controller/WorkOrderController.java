package com.gestaooficina.controller;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.AssignWorkOrderMechanicRequest;
import com.gestaooficina.model.dto.CreateWorkOrderItemRequest;
import com.gestaooficina.model.dto.CreateWorkOrderRequest;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.model.dto.UpdateWorkOrderItemRequest;
import com.gestaooficina.model.dto.UpdateWorkOrderPaymentRequest;
import com.gestaooficina.model.dto.UpdateWorkOrderStatusRequest;
import com.gestaooficina.service.WorkOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaControllerMapping.WORK_ORDERS_PATH)
@Tag(name = "Work Orders", description = "Work order management")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class WorkOrderController extends BaseController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @GetMapping(GestaoOficinaControllerMapping.WORK_ORDERS_PANORAMA)
    @Operation(summary = "Work order panorama by status")
    public ResponseEntity<HttpResponseEntityDTO<?>> panorama() {
        try {
            return ok(workOrderService.panorama(), "Panorama loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @GetMapping
    @Operation(summary = "List work orders")
    public ResponseEntity<HttpResponseEntityDTO<?>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        try {
            return ok(workOrderService.list(status, page, pageSize), "Work orders loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get work order detail")
    public ResponseEntity<HttpResponseEntityDTO<?>> getById(@PathVariable Long id) {
        try {
            return ok(workOrderService.findById(id), "Work order loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PostMapping
    @Operation(summary = "Create work order")
    public ResponseEntity<HttpResponseEntityDTO<?>> create(
            Authentication authentication,
            @RequestBody CreateWorkOrderRequest request) {
        try {
            return created(
                    workOrderService.create(request, requireUserId(authentication), requireEmail(authentication)),
                    "Work order created.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update work order status")
    public ResponseEntity<HttpResponseEntityDTO<?>> updateStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody UpdateWorkOrderStatusRequest request) {
        try {
            return ok(
                    workOrderService.updateStatus(id, request, requireUserId(authentication), requireEmail(authentication)),
                    "Status updated.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PutMapping("/{id}/payment")
    @Operation(summary = "Update work order payment status")
    public ResponseEntity<HttpResponseEntityDTO<?>> updatePayment(
            @PathVariable Long id,
            @RequestBody UpdateWorkOrderPaymentRequest request) {
        try {
            return ok(workOrderService.updatePayment(id, request), "Payment status updated.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PutMapping("/{id}/mechanic")
    @Operation(summary = "Assign mechanic")
    public ResponseEntity<HttpResponseEntityDTO<?>> assignMechanic(
            @PathVariable Long id,
            @RequestBody AssignWorkOrderMechanicRequest request) {
        try {
            return ok(workOrderService.assignMechanic(id, request), "Mechanic assigned.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PostMapping("/{id}/items")
    @Operation(summary = "Add work order item")
    public ResponseEntity<HttpResponseEntityDTO<?>> addItem(
            @PathVariable Long id,
            @RequestBody CreateWorkOrderItemRequest request) {
        try {
            return created(workOrderService.addItem(id, request), "Item added.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PutMapping(GestaoOficinaControllerMapping.WORK_ORDERS_ITEMS + "/{itemId}")
    @Operation(summary = "Update work order item")
    public ResponseEntity<HttpResponseEntityDTO<?>> updateItem(
            @PathVariable Long itemId,
            @RequestBody UpdateWorkOrderItemRequest request) {
        try {
            workOrderService.updateItem(itemId, request);
            return ok(null, "Item updated.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @DeleteMapping(GestaoOficinaControllerMapping.WORK_ORDERS_ITEMS + "/{itemId}")
    @Operation(summary = "Delete work order item")
    public ResponseEntity<HttpResponseEntityDTO<?>> deleteItem(@PathVariable Long itemId) {
        try {
            workOrderService.deleteItem(itemId);
            return ok(null, "Item deleted.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }
}

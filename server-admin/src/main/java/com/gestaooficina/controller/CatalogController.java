package com.gestaooficina.controller;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.CreatePartCatalogRequest;
import com.gestaooficina.model.dto.CreateServiceCatalogRequest;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.model.dto.UpdatePartCatalogRequest;
import com.gestaooficina.model.dto.UpdateServiceCatalogRequest;
import com.gestaooficina.service.CatalogService;
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
@RequestMapping(GestaoOficinaControllerMapping.CATALOGS_PATH)
@Tag(name = "Catalogs", description = "Service and part catalogs")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class CatalogController extends BaseController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping(GestaoOficinaControllerMapping.CATALOGS_SERVICES)
    @Operation(summary = "List services")
    public ResponseEntity<HttpResponseEntityDTO<?>> listServices(
            @RequestParam(required = false) Boolean onlyActive) {
        try {
            return ok(catalogService.listServices(onlyActive), "Services loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PostMapping(GestaoOficinaControllerMapping.CATALOGS_SERVICES)
    @Operation(summary = "Create service")
    public ResponseEntity<HttpResponseEntityDTO<?>> createService(@RequestBody CreateServiceCatalogRequest request) {
        try {
            return created(catalogService.createService(request), "Service created.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PutMapping(GestaoOficinaControllerMapping.CATALOGS_SERVICES + "/{id}")
    @Operation(summary = "Update service")
    public ResponseEntity<HttpResponseEntityDTO<?>> updateService(
            @PathVariable Long id,
            @RequestBody UpdateServiceCatalogRequest request) {
        try {
            return ok(catalogService.updateService(id, request), "Service updated.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @GetMapping(GestaoOficinaControllerMapping.CATALOGS_PARTS)
    @Operation(summary = "List parts")
    public ResponseEntity<HttpResponseEntityDTO<?>> listParts(
            @RequestParam(required = false) Boolean onlyActive) {
        try {
            return ok(catalogService.listParts(onlyActive), "Parts loaded.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PostMapping(GestaoOficinaControllerMapping.CATALOGS_PARTS)
    @Operation(summary = "Create part")
    public ResponseEntity<HttpResponseEntityDTO<?>> createPart(@RequestBody CreatePartCatalogRequest request) {
        try {
            return created(catalogService.createPart(request), "Part created.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }

    @PutMapping(GestaoOficinaControllerMapping.CATALOGS_PARTS + "/{id}")
    @Operation(summary = "Update part")
    public ResponseEntity<HttpResponseEntityDTO<?>> updatePart(
            @PathVariable Long id,
            @RequestBody UpdatePartCatalogRequest request) {
        try {
            return ok(catalogService.updatePart(id, request), "Part updated.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }
}

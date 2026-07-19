package com.gestaooficina.controller;

import com.gestaooficina.config.OpenApiConfig;
import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.HttpResponseEntityDTO;
import com.gestaooficina.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(GestaoOficinaControllerMapping.SEARCH_PATH)
@Tag(name = "Search", description = "Quick search")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class SearchController extends BaseController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    @Operation(summary = "Quick search customers and vehicles")
    public ResponseEntity<HttpResponseEntityDTO<?>> quickSearch(
            @RequestParam("q") String query,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        try {
            return ok(searchService.quickSearch(query, page, pageSize), "Search completed.");
        } catch (GestaoOficinaForbiddenException e) {
            return forbidden(e);
        } catch (GestaoOficinaGenericException e) {
            return genericError(e);
        } catch (Exception e) {
            return internalError(e);
        }
    }
}

package com.gestaooficina.repository;

import com.gestaooficina.model.dto.PartCatalogDTO;

import java.util.List;
import java.util.Optional;

public interface PartCatalogRepository {

    List<PartCatalogDTO> list(Boolean onlyActive);

    Optional<PartCatalogDTO> findById(Long id);

    Long insert(String name, Boolean active);

    void update(Long id, String name, Boolean active);
}

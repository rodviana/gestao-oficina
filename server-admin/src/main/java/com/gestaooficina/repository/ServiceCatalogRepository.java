package com.gestaooficina.repository;

import com.gestaooficina.model.dto.ServiceCatalogDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ServiceCatalogRepository {

    long count(Boolean onlyActive, String search);

    List<ServiceCatalogDTO> list(Boolean onlyActive, String search, int page, int pageSize);

    Optional<ServiceCatalogDTO> findById(Long id);

    Long insert(String name, BigDecimal defaultPrice, Boolean active);

    void update(Long id, String name, BigDecimal defaultPrice, Boolean active);
}

package com.gestaooficina.repository;

import com.gestaooficina.model.dto.CustomerDTO;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository {

    Optional<CustomerDTO> findById(Long id);

    List<CustomerDTO> findByPhone(String phone);

    long countSearch(String search);

    List<CustomerDTO> search(String search, int page, int pageSize);

    Long insert(String name, String document, String phone, String email, String passwordHash);

    void update(Long id, String name, String document, String phone, Boolean active);
}

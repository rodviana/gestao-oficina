package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.CreateCustomerRequest;
import com.gestaooficina.model.dto.CustomerDTO;
import com.gestaooficina.model.dto.PageResultDTO;
import com.gestaooficina.model.dto.UpdateCustomerRequest;
import com.gestaooficina.repository.CustomerRepository;
import com.gestaooficina.utils.JdbcMappingUtils;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public PageResultDTO<CustomerDTO> search(String search, Integer page, Integer pageSize) {
        int safePageSize = JdbcMappingUtils.clampPageSize(pageSize);
        int safePage = JdbcMappingUtils.safePage(page);
        UserValidationUtils.validatePagination(safePage, safePageSize);

        String normalizedSearch = search != null ? search.trim() : null;
        long total = customerRepository.countSearch(normalizedSearch);
        int pageMax = total <= 0 ? 0 : (int) ((total - 1) / safePageSize);
        int resolvedPage = Math.min(safePage, pageMax);

        List<CustomerDTO> items = customerRepository.search(normalizedSearch, resolvedPage, safePageSize);
        return new PageResultDTO<>(items, total, resolvedPage, safePageSize, pageMax);
    }

    public CustomerDTO findById(Long id) {
        UserValidationUtils.requirePositiveId(id, "Cliente inválido.");
        return customerRepository.findById(id)
                .orElseThrow(() -> new GestaoOficinaGenericException("Cliente não encontrado."));
    }

    public List<CustomerDTO> findByPhone(String phone) {
        UserValidationUtils.requireNonBlank(phone, "Telefone é obrigatório.");
        return customerRepository.findByPhone(phone.trim());
    }

    public CustomerDTO create(CreateCustomerRequest request) {
        validateCreate(request);
        Long id = customerRepository.insert(
                request.getName().trim(),
                request.getDocument(),
                request.getPhone().trim());
        return findById(id);
    }

    public CustomerDTO update(Long id, UpdateCustomerRequest request) {
        UserValidationUtils.requirePositiveId(id, "Cliente inválido.");
        findById(id);
        validateUpdate(request);
        customerRepository.update(
                id,
                request.getName().trim(),
                request.getDocument(),
                request.getPhone().trim(),
                request.getActive());
        return findById(id);
    }

    private void validateCreate(CreateCustomerRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Dados inválidos.");
        }
        UserValidationUtils.requireNonBlank(request.getName(), "Nome é obrigatório.");
        UserValidationUtils.requireNonBlank(request.getPhone(), "Telefone é obrigatório.");
    }

    private void validateUpdate(UpdateCustomerRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Dados inválidos.");
        }
        UserValidationUtils.requireNonBlank(request.getName(), "Nome é obrigatório.");
        UserValidationUtils.requireNonBlank(request.getPhone(), "Telefone é obrigatório.");
    }
}

package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.CreatePartCatalogRequest;
import com.gestaooficina.model.dto.CreateServiceCatalogRequest;
import com.gestaooficina.model.dto.PartCatalogDTO;
import com.gestaooficina.model.dto.ServiceCatalogDTO;
import com.gestaooficina.model.dto.UpdatePartCatalogRequest;
import com.gestaooficina.model.dto.UpdateServiceCatalogRequest;
import com.gestaooficina.repository.PartCatalogRepository;
import com.gestaooficina.repository.ServiceCatalogRepository;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CatalogService {

    private final ServiceCatalogRepository serviceCatalogRepository;
    private final PartCatalogRepository partCatalogRepository;

    public CatalogService(ServiceCatalogRepository serviceCatalogRepository,
                          PartCatalogRepository partCatalogRepository) {
        this.serviceCatalogRepository = serviceCatalogRepository;
        this.partCatalogRepository = partCatalogRepository;
    }

    public List<ServiceCatalogDTO> listServices(Boolean onlyActive) {
        return serviceCatalogRepository.list(onlyActive);
    }

    public ServiceCatalogDTO findServiceById(Long id) {
        UserValidationUtils.requirePositiveId(id, "Serviço inválido.");
        return serviceCatalogRepository.findById(id)
                .orElseThrow(() -> new GestaoOficinaGenericException("Serviço não encontrado."));
    }

    public ServiceCatalogDTO createService(CreateServiceCatalogRequest request) {
        validateServiceCreate(request);
        Long id = serviceCatalogRepository.insert(
                request.getName().trim(),
                request.getDefaultPrice(),
                request.getActive() != null ? request.getActive() : Boolean.TRUE);
        return findServiceById(id);
    }

    public ServiceCatalogDTO updateService(Long id, UpdateServiceCatalogRequest request) {
        findServiceById(id);
        validateServiceUpdate(request);
        serviceCatalogRepository.update(
                id,
                request.getName().trim(),
                request.getDefaultPrice(),
                request.getActive());
        return findServiceById(id);
    }

    public List<PartCatalogDTO> listParts(Boolean onlyActive) {
        return partCatalogRepository.list(onlyActive);
    }

    public PartCatalogDTO findPartById(Long id) {
        UserValidationUtils.requirePositiveId(id, "Peça inválida.");
        return partCatalogRepository.findById(id)
                .orElseThrow(() -> new GestaoOficinaGenericException("Peça não encontrada."));
    }

    public PartCatalogDTO createPart(CreatePartCatalogRequest request) {
        validatePartCreate(request);
        Long id = partCatalogRepository.insert(
                request.getName().trim(),
                request.getActive() != null ? request.getActive() : Boolean.TRUE);
        return findPartById(id);
    }

    public PartCatalogDTO updatePart(Long id, UpdatePartCatalogRequest request) {
        findPartById(id);
        validatePartUpdate(request);
        partCatalogRepository.update(id, request.getName().trim(), request.getActive());
        return findPartById(id);
    }

    private void validateServiceCreate(CreateServiceCatalogRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Dados inválidos.");
        }
        UserValidationUtils.requireNonBlank(request.getName(), "Nome é obrigatório.");
    }

    private void validateServiceUpdate(UpdateServiceCatalogRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Dados inválidos.");
        }
        UserValidationUtils.requireNonBlank(request.getName(), "Nome é obrigatório.");
    }

    private void validatePartCreate(CreatePartCatalogRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Dados inválidos.");
        }
        UserValidationUtils.requireNonBlank(request.getName(), "Nome é obrigatório.");
    }

    private void validatePartUpdate(UpdatePartCatalogRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Dados inválidos.");
        }
        UserValidationUtils.requireNonBlank(request.getName(), "Nome é obrigatório.");
    }
}

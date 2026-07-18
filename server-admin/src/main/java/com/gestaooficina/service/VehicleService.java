package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.CreateVehicleRequest;
import com.gestaooficina.model.dto.PageResultDTO;
import com.gestaooficina.model.dto.UpdateVehicleRequest;
import com.gestaooficina.model.dto.VehicleDTO;
import com.gestaooficina.model.dto.WorkOrderSummaryDTO;
import com.gestaooficina.repository.VehicleRepository;
import com.gestaooficina.utils.JdbcMappingUtils;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public PageResultDTO<VehicleDTO> search(String search, Integer page, Integer pageSize) {
        int safePageSize = JdbcMappingUtils.clampPageSize(pageSize);
        int safePage = JdbcMappingUtils.safePage(page);
        UserValidationUtils.validatePagination(safePage, safePageSize);

        String normalizedSearch = search != null ? search.trim() : null;
        long total = vehicleRepository.countSearch(normalizedSearch);
        int pageMax = total <= 0 ? 0 : (int) ((total - 1) / safePageSize);
        int resolvedPage = Math.min(safePage, pageMax);

        List<VehicleDTO> items = vehicleRepository.search(normalizedSearch, resolvedPage, safePageSize);
        return new PageResultDTO<>(items, total, resolvedPage, safePageSize, pageMax);
    }

    public VehicleDTO findById(Long id) {
        UserValidationUtils.requirePositiveId(id, "Veículo inválido.");
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new GestaoOficinaGenericException("Veículo não encontrado."));
    }

    public VehicleDTO findByPlate(String plate) {
        UserValidationUtils.requireNonBlank(plate, "Placa é obrigatória.");
        return vehicleRepository.findByPlate(plate.trim())
                .orElseThrow(() -> new GestaoOficinaGenericException("Veículo não encontrado."));
    }

    public List<VehicleDTO> findByCustomer(Long customerId) {
        UserValidationUtils.requirePositiveId(customerId, "Cliente inválido.");
        return vehicleRepository.findByCustomer(customerId);
    }

    public List<WorkOrderSummaryDTO> findHistory(Long vehicleId) {
        findById(vehicleId);
        return vehicleRepository.findWorkOrderHistory(vehicleId);
    }

    public VehicleDTO create(CreateVehicleRequest request) {
        validateCreate(request);
        Long id = vehicleRepository.insert(
                request.getCustomerId(),
                request.getPlate(),
                request.getBrand(),
                request.getModel(),
                request.getYear());
        return findById(id);
    }

    public VehicleDTO update(Long id, UpdateVehicleRequest request) {
        UserValidationUtils.requirePositiveId(id, "Veículo inválido.");
        findById(id);
        validateUpdate(request);
        vehicleRepository.update(
                id,
                request.getCustomerId(),
                request.getPlate(),
                request.getBrand(),
                request.getModel(),
                request.getYear(),
                request.getActive());
        return findById(id);
    }

    private void validateCreate(CreateVehicleRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Dados inválidos.");
        }
        UserValidationUtils.requirePositiveId(request.getCustomerId(), "Cliente é obrigatório.");
        UserValidationUtils.requireNonBlank(request.getPlate(), "Placa é obrigatória.");
        UserValidationUtils.requireNonBlank(request.getBrand(), "Marca é obrigatória.");
        UserValidationUtils.requireNonBlank(request.getModel(), "Modelo é obrigatório.");
    }

    private void validateUpdate(UpdateVehicleRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Dados inválidos.");
        }
        UserValidationUtils.requirePositiveId(request.getCustomerId(), "Cliente é obrigatório.");
        UserValidationUtils.requireNonBlank(request.getPlate(), "Placa é obrigatória.");
        UserValidationUtils.requireNonBlank(request.getBrand(), "Marca é obrigatória.");
        UserValidationUtils.requireNonBlank(request.getModel(), "Modelo é obrigatório.");
    }
}

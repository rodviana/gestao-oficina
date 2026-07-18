package com.gestaooficina.repository;

import com.gestaooficina.model.dto.VehicleDTO;
import com.gestaooficina.model.dto.WorkOrderSummaryDTO;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository {

    Optional<VehicleDTO> findById(Long id);

    Optional<VehicleDTO> findByPlate(String plate);

    List<VehicleDTO> findByCustomer(Long customerId);

    long countSearch(String search);

    List<VehicleDTO> search(String search, int page, int pageSize);

    List<WorkOrderSummaryDTO> findWorkOrderHistory(Long vehicleId);

    Long insert(Long customerId, String plate, String brand, String model, Integer year);

    void update(Long id, Long customerId, String plate, String brand, String model, Integer year, Boolean active);
}

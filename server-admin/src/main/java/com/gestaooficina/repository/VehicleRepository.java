package com.gestaooficina.repository;

import com.gestaooficina.model.dto.VehicleDTO;
import com.gestaooficina.model.dto.WorkOrderSummaryDTO;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository {

    Optional<VehicleDTO> findById(Long id);

    Optional<VehicleDTO> findByPlate(String plate);

    long countByCustomer(Long customerId);

    List<VehicleDTO> findByCustomer(Long customerId, int page, int pageSize);

    long countSearch(String search);

    List<VehicleDTO> search(String search, int page, int pageSize);

    long countWorkOrderHistory(Long vehicleId);

    List<WorkOrderSummaryDTO> findWorkOrderHistory(Long vehicleId, int page, int pageSize);

    Long insert(Long customerId, String plate, String brand, String model, Integer year);

    void update(Long id, Long customerId, String plate, String brand, String model, Integer year, Boolean active);
}

package com.gestaooficina.repository;

import com.gestaooficina.model.dto.CustomerMeSummaryDto;
import com.gestaooficina.model.dto.VehicleDto;
import com.gestaooficina.model.dto.WorkOrderSummaryDto;

import java.util.List;
import java.util.Optional;

public interface CustomerMeRepository {

    long countVehicles(Long customerId);

    List<VehicleDto> findVehicles(Long customerId, int page, int pageSize);

    long countOrders(Long customerId, String statusGroup, Long vehicleId);

    List<WorkOrderSummaryDto> findOrders(Long customerId, String statusGroup, Long vehicleId,
                                         int page, int pageSize);

    Optional<CustomerMeSummaryDto> findSummary(Long customerId);
}

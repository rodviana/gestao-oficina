package com.gestaooficina.repository;

import com.gestaooficina.model.dto.VehicleDto;
import com.gestaooficina.model.dto.WorkOrderSummaryDto;

import java.util.List;

public interface CustomerMeRepository {

    List<VehicleDto> findVehiclesByCustomerId(Long customerId);

    List<WorkOrderSummaryDto> findOrdersByCustomerId(Long customerId);
}

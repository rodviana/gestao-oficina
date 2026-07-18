package com.gestaooficina.repository;

import com.gestaooficina.model.dto.WorkOrderDetailDto;
import com.gestaooficina.model.dto.WorkOrderItemDto;
import com.gestaooficina.model.dto.WorkOrderTimelineEntryDto;

import java.util.List;
import java.util.Optional;

public interface WorkOrderRepository {

    Optional<WorkOrderDetailDto> findById(Long id);

    Optional<WorkOrderDetailDto> trackByNumberAndPlate(String number, String plate);

    List<WorkOrderItemDto> findItemsByOrderId(Long workOrderId);

    List<WorkOrderTimelineEntryDto> findHistoryByOrderId(Long workOrderId);
}

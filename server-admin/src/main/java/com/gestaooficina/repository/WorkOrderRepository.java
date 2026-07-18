package com.gestaooficina.repository;

import com.gestaooficina.model.dto.WorkOrderDTO;
import com.gestaooficina.model.dto.WorkOrderHistoryDTO;
import com.gestaooficina.model.dto.WorkOrderItemDTO;
import com.gestaooficina.model.dto.WorkOrderPanoramaDTO;
import com.gestaooficina.model.dto.WorkOrderSummaryDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface WorkOrderRepository {

    Optional<WorkOrderDTO> findById(Long id);

    long count(String statusCode);

    List<WorkOrderSummaryDTO> list(String statusCode, int page, int pageSize);

    Long insert(Long customerId, Long vehicleId, String description, Long createdById, Long mechanicId);

    void updateStatus(Long id, String statusCode, Long changedById, String note);

    void updatePayment(Long id, String paymentCode);

    void assignMechanic(Long id, Long mechanicId);

    List<WorkOrderItemDTO> findItemsByOrder(Long workOrderId);

    Long insertItem(Long workOrderId, String itemTypeCode, Long serviceId, Long partId,
                    String description, BigDecimal quantity, BigDecimal unitPrice);

    void updateItem(Long itemId, BigDecimal quantity, BigDecimal unitPrice, String description);

    void deleteItem(Long itemId);

    List<WorkOrderHistoryDTO> findHistory(Long workOrderId);

    List<WorkOrderPanoramaDTO> panorama();
}

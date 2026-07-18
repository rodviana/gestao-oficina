package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.VehicleDto;
import com.gestaooficina.model.dto.WorkOrderDetailDto;
import com.gestaooficina.model.dto.WorkOrderSummaryDto;
import com.gestaooficina.repository.CustomerMeRepository;
import com.gestaooficina.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebMeService {

    private final CustomerMeRepository customerMeRepository;
    private final WorkOrderRepository workOrderRepository;

    public WebMeService(CustomerMeRepository customerMeRepository,
                          WorkOrderRepository workOrderRepository) {
        this.customerMeRepository = customerMeRepository;
        this.workOrderRepository = workOrderRepository;
    }

    public List<WorkOrderSummaryDto> getOrders(Long customerId) {
        return customerMeRepository.findOrdersByCustomerId(customerId);
    }

    public List<VehicleDto> getVehicles(Long customerId) {
        return customerMeRepository.findVehiclesByCustomerId(customerId);
    }

    public WorkOrderDetailDto getOrderById(Long customerId, Long orderId) {
        WorkOrderDetailDto order = workOrderRepository.findById(orderId)
                .orElseThrow(() -> new GestaoOficinaGenericException("OS não encontrada."));

        if (!customerId.equals(order.getCustomerId())) {
            throw new GestaoOficinaForbiddenException("Esta OS não pertence à sua conta.");
        }

        enrichWithItemsAndTimeline(order);
        return order;
    }

    private void enrichWithItemsAndTimeline(WorkOrderDetailDto order) {
        order.setItems(workOrderRepository.findItemsByOrderId(order.getId()));
        order.setTimeline(workOrderRepository.findHistoryByOrderId(order.getId()));
    }
}

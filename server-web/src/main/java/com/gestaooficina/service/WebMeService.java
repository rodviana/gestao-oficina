package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaForbiddenException;
import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.CustomerMeSummaryDto;
import com.gestaooficina.model.dto.PageResultDTO;
import com.gestaooficina.model.dto.VehicleDto;
import com.gestaooficina.model.dto.WorkOrderDetailDto;
import com.gestaooficina.model.dto.WorkOrderSummaryDto;
import com.gestaooficina.repository.CustomerMeRepository;
import com.gestaooficina.repository.WorkOrderRepository;
import com.gestaooficina.utils.PageUtils;
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

    public PageResultDTO<WorkOrderSummaryDto> getOrders(
            Long customerId,
            String statusGroup,
            Long vehicleId,
            Integer page,
            Integer pageSize) {
        int safePageSize = PageUtils.clampPageSize(pageSize);
        int safePage = PageUtils.safePage(page);
        PageUtils.validate(safePage, safePageSize);

        String group = normalizeStatusGroup(statusGroup);
        long total = customerMeRepository.countOrders(customerId, group, vehicleId);
        int pageMax = PageUtils.pageMaxNumber(total, safePageSize);
        int resolved = Math.min(safePage, pageMax);
        List<WorkOrderSummaryDto> items =
                customerMeRepository.findOrders(customerId, group, vehicleId, resolved, safePageSize);
        return new PageResultDTO<>(items, total, resolved, safePageSize, pageMax);
    }

    public PageResultDTO<VehicleDto> getVehicles(Long customerId, Integer page, Integer pageSize) {
        int safePageSize = PageUtils.clampPageSize(pageSize);
        int safePage = PageUtils.safePage(page);
        PageUtils.validate(safePage, safePageSize);

        long total = customerMeRepository.countVehicles(customerId);
        int pageMax = PageUtils.pageMaxNumber(total, safePageSize);
        int resolved = Math.min(safePage, pageMax);
        List<VehicleDto> items = customerMeRepository.findVehicles(customerId, resolved, safePageSize);
        return new PageResultDTO<>(items, total, resolved, safePageSize, pageMax);
    }

    public CustomerMeSummaryDto getSummary(Long customerId) {
        return customerMeRepository.findSummary(customerId)
                .orElse(new CustomerMeSummaryDto(0, 0, 0, 0));
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

    private static String normalizeStatusGroup(String statusGroup) {
        if (statusGroup == null || statusGroup.isBlank()) {
            return "ALL";
        }
        String upper = statusGroup.trim().toUpperCase();
        if (!upper.equals("ALL") && !upper.equals("ACTIVE") && !upper.equals("HISTORY")) {
            throw new GestaoOficinaGenericException("Filtro de status inválido.");
        }
        return upper;
    }
}

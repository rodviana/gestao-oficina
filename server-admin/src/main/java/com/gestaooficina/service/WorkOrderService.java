package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.AssignWorkOrderMechanicRequest;
import com.gestaooficina.model.dto.CreateWorkOrderItemRequest;
import com.gestaooficina.model.dto.CreateWorkOrderRequest;
import com.gestaooficina.model.dto.PageResultDTO;
import com.gestaooficina.model.dto.UpdateWorkOrderItemRequest;
import com.gestaooficina.model.dto.UpdateWorkOrderPaymentRequest;
import com.gestaooficina.model.dto.UpdateWorkOrderStatusRequest;
import com.gestaooficina.model.dto.WorkOrderDTO;
import com.gestaooficina.model.dto.WorkOrderItemDTO;
import com.gestaooficina.model.dto.WorkOrderPanoramaDTO;
import com.gestaooficina.model.dto.WorkOrderSummaryDTO;
import com.gestaooficina.repository.WorkOrderRepository;
import com.gestaooficina.utils.JdbcMappingUtils;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final AuthSupport authSupport;

    public WorkOrderService(WorkOrderRepository workOrderRepository, AuthSupport authSupport) {
        this.workOrderRepository = workOrderRepository;
        this.authSupport = authSupport;
    }

    public PageResultDTO<WorkOrderSummaryDTO> list(String status, Integer page, Integer pageSize) {
        int safePageSize = JdbcMappingUtils.clampPageSize(pageSize);
        int safePage = JdbcMappingUtils.safePage(page);
        UserValidationUtils.validatePagination(safePage, safePageSize);

        String statusCode = status != null && !status.isBlank() ? status.trim() : null;
        long total = workOrderRepository.count(statusCode);
        int pageMax = total <= 0 ? 0 : (int) ((total - 1) / safePageSize);
        int resolvedPage = Math.min(safePage, pageMax);

        List<WorkOrderSummaryDTO> items = workOrderRepository.list(statusCode, resolvedPage, safePageSize);
        return new PageResultDTO<>(items, total, resolvedPage, safePageSize, pageMax);
    }

    public WorkOrderDTO findById(Long id) {
        UserValidationUtils.requirePositiveId(id, "Ordem de serviço inválida.");
        WorkOrderDTO order = workOrderRepository.findById(id)
                .orElseThrow(() -> new GestaoOficinaGenericException("Ordem de serviço não encontrada."));
        order.setItems(workOrderRepository.findItemsByOrder(id));
        order.setHistory(workOrderRepository.findHistory(id));
        return order;
    }

    public WorkOrderDTO create(CreateWorkOrderRequest request, Long jwtUserId, String email) {
        validateCreate(request);
        Long createdById = authSupport.resolveUserId(jwtUserId, email);
        Long id = workOrderRepository.insert(
                request.getCustomerId(),
                request.getVehicleId(),
                request.getDescription(),
                createdById,
                request.getMechanicId());
        return findById(id);
    }

    public WorkOrderDTO updateStatus(Long id, UpdateWorkOrderStatusRequest request, Long jwtUserId, String email) {
        findById(id);
        UserValidationUtils.requireNonBlank(request != null ? request.getStatusCode() : null, "Status é obrigatório.");
        Long changedById = authSupport.resolveUserId(jwtUserId, email);
        workOrderRepository.updateStatus(id, request.getStatusCode().trim(), changedById, request.getNote());
        return findById(id);
    }

    public WorkOrderDTO updatePayment(Long id, UpdateWorkOrderPaymentRequest request) {
        findById(id);
        UserValidationUtils.requireNonBlank(
                request != null ? request.getPaymentStatusCode() : null, "Status de pagamento é obrigatório.");
        workOrderRepository.updatePayment(id, request.getPaymentStatusCode().trim());
        return findById(id);
    }

    public WorkOrderDTO assignMechanic(Long id, AssignWorkOrderMechanicRequest request) {
        findById(id);
        UserValidationUtils.requirePositiveId(
                request != null ? request.getMechanicId() : null, "Mecânico é obrigatório.");
        workOrderRepository.assignMechanic(id, request.getMechanicId());
        return findById(id);
    }

    public WorkOrderItemDTO addItem(Long workOrderId, CreateWorkOrderItemRequest request) {
        findById(workOrderId);
        validateItemCreate(request);
        Long itemId = workOrderRepository.insertItem(
                workOrderId,
                request.getItemTypeCode().trim(),
                request.getServiceId(),
                request.getPartId(),
                request.getDescription(),
                request.getQuantity(),
                request.getUnitPrice());
        return workOrderRepository.findItemsByOrder(workOrderId).stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new GestaoOficinaGenericException("Item não encontrado."));
    }

    public void updateItem(Long itemId, UpdateWorkOrderItemRequest request) {
        UserValidationUtils.requirePositiveId(itemId, "Item inválido.");
        workOrderRepository.updateItem(
                itemId,
                request != null ? request.getQuantity() : null,
                request != null ? request.getUnitPrice() : null,
                request != null ? request.getDescription() : null);
    }

    public void deleteItem(Long itemId) {
        UserValidationUtils.requirePositiveId(itemId, "Item inválido.");
        workOrderRepository.deleteItem(itemId);
    }

    public List<WorkOrderPanoramaDTO> panorama() {
        return workOrderRepository.panorama();
    }

    private void validateCreate(CreateWorkOrderRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Dados inválidos.");
        }
        UserValidationUtils.requirePositiveId(request.getCustomerId(), "Cliente é obrigatório.");
        UserValidationUtils.requirePositiveId(request.getVehicleId(), "Veículo é obrigatório.");
    }

    private void validateItemCreate(CreateWorkOrderItemRequest request) {
        if (request == null) {
            throw new GestaoOficinaGenericException("Dados inválidos.");
        }
        UserValidationUtils.requireNonBlank(request.getItemTypeCode(), "Tipo do item é obrigatório.");
        UserValidationUtils.requireNonBlank(request.getDescription(), "Descrição é obrigatória.");
    }
}

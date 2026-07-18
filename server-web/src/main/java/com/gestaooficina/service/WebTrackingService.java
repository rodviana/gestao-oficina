package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.WorkOrderDetailDto;
import com.gestaooficina.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

@Service
public class WebTrackingService {

    private final WorkOrderRepository workOrderRepository;

    public WebTrackingService(WorkOrderRepository workOrderRepository) {
        this.workOrderRepository = workOrderRepository;
    }

    public WorkOrderDetailDto track(String number, String plate) {
        if (isBlank(number)) {
            throw new GestaoOficinaGenericException("Informe o número da OS.");
        }
        if (isBlank(plate)) {
            throw new GestaoOficinaGenericException("Informe a placa do veículo.");
        }

        WorkOrderDetailDto order = workOrderRepository.trackByNumberAndPlate(number.trim(), plate.trim())
                .orElseThrow(() -> new GestaoOficinaGenericException(
                        "Não encontramos essa OS com essa placa. Confira os dados do comprovante."));

        order.setItems(workOrderRepository.findItemsByOrderId(order.getId()));
        order.setTimeline(workOrderRepository.findHistoryByOrderId(order.getId()));
        return order;
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

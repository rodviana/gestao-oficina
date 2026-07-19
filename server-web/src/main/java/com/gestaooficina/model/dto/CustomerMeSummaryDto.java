package com.gestaooficina.model.dto;

public class CustomerMeSummaryDto {

    private long vehicleCount;
    private long activeOrderCount;
    private long historyOrderCount;
    private long totalOrderCount;

    public CustomerMeSummaryDto() {
    }

    public CustomerMeSummaryDto(long vehicleCount, long activeOrderCount,
                                long historyOrderCount, long totalOrderCount) {
        this.vehicleCount = vehicleCount;
        this.activeOrderCount = activeOrderCount;
        this.historyOrderCount = historyOrderCount;
        this.totalOrderCount = totalOrderCount;
    }

    public long getVehicleCount() {
        return vehicleCount;
    }

    public void setVehicleCount(long vehicleCount) {
        this.vehicleCount = vehicleCount;
    }

    public long getActiveOrderCount() {
        return activeOrderCount;
    }

    public void setActiveOrderCount(long activeOrderCount) {
        this.activeOrderCount = activeOrderCount;
    }

    public long getHistoryOrderCount() {
        return historyOrderCount;
    }

    public void setHistoryOrderCount(long historyOrderCount) {
        this.historyOrderCount = historyOrderCount;
    }

    public long getTotalOrderCount() {
        return totalOrderCount;
    }

    public void setTotalOrderCount(long totalOrderCount) {
        this.totalOrderCount = totalOrderCount;
    }
}

package com.gestaooficina.model.dto;

public class QuickSearchResultDTO {

    private String resultType;
    private Long id;
    private String label;
    private String subtitle;
    private Long customerId;
    private Long vehicleId;

    public QuickSearchResultDTO() {
    }

    public QuickSearchResultDTO(String resultType, Long id, String label, String subtitle,
                                Long customerId, Long vehicleId) {
        this.resultType = resultType;
        this.id = id;
        this.label = label;
        this.subtitle = subtitle;
        this.customerId = customerId;
        this.vehicleId = vehicleId;
    }

    public String getResultType() {
        return resultType;
    }

    public void setResultType(String resultType) {
        this.resultType = resultType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
}

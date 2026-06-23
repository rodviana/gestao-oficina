package com.gestaooficina.model.response;

public class AdminPanelResponse {

    private final String title;
    private final String message;
    private final String adminName;

    public AdminPanelResponse(String title, String message, String adminName) {
        this.title = title;
        this.message = message;
        this.adminName = adminName;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getAdminName() {
        return adminName;
    }
}

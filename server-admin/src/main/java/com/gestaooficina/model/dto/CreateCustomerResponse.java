package com.gestaooficina.model.dto;

/**
 * Resposta do cadastro de cliente. A senha temporária da conta do portal
 * só é exposta aqui, uma única vez — não é persistida em claro.
 */
public class CreateCustomerResponse {

    private final CustomerDTO customer;
    private final String portalEmail;
    private final String temporaryPassword;

    public CreateCustomerResponse(CustomerDTO customer, String portalEmail, String temporaryPassword) {
        this.customer = customer;
        this.portalEmail = portalEmail;
        this.temporaryPassword = temporaryPassword;
    }

    public CustomerDTO getCustomer() {
        return customer;
    }

    public String getPortalEmail() {
        return portalEmail;
    }

    public String getTemporaryPassword() {
        return temporaryPassword;
    }
}

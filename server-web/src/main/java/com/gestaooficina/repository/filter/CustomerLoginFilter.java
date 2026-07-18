package com.gestaooficina.repository.filter;

public class CustomerLoginFilter {

    private final String login;

    public CustomerLoginFilter(String login) {
        this.login = login;
    }

    public String getLogin() {
        return login;
    }
}

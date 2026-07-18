package com.gestaooficina.model.record;

public class CustomerRecord {

    private final Long id;
    private final String name;
    private final String email;
    private final String phone;
    private final String password;
    private final boolean active;

    public CustomerRecord(Long id, String name, String email, String phone, String password, boolean active) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPassword() {
        return password;
    }

    public boolean isActive() {
        return active;
    }
}

package com.gestaooficina.controller;

/**
 * Constantes de rotas da API.
 */
public final class GestaoOficinaControllerMapping {

    private static final String API_VERSION_V1 = "/api/v1";

    public static final String HEALTH_PATH = "/api/health";

    public static final String AUTH_PATH = API_VERSION_V1 + "/auth";
    public static final String HOME_PATH = API_VERSION_V1 + "/home";
    public static final String ADMIN_PATH = API_VERSION_V1 + "/admin";
    public static final String CUSTOMERS_PATH = API_VERSION_V1 + "/customers";
    public static final String VEHICLES_PATH = API_VERSION_V1 + "/vehicles";
    public static final String CATALOGS_PATH = API_VERSION_V1 + "/catalogs";
    public static final String WORK_ORDERS_PATH = API_VERSION_V1 + "/work-orders";
    public static final String SEARCH_PATH = API_VERSION_V1 + "/search";

    public static final String AUTH_LOGIN = "/login";
    public static final String ADMIN_PANEL = "/panel";
    public static final String ADMIN_USERS = "/users";
    public static final String ADMIN_USERS_LIST = "/users/list";

    public static final String CATALOGS_SERVICES = "/services";
    public static final String CATALOGS_PARTS = "/parts";

    public static final String VEHICLES_BY_PLATE = "/by-plate";
    public static final String VEHICLES_BY_CUSTOMER = "/by-customer";
    public static final String WORK_ORDERS_PANORAMA = "/panorama";
    public static final String WORK_ORDERS_ITEMS = "/items";
    public static final String CUSTOMERS_BY_PHONE = "/by-phone";

    private GestaoOficinaControllerMapping() {
    }
}

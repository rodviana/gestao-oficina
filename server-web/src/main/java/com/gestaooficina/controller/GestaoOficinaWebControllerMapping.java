package com.gestaooficina.controller;

/**
 * Constantes de rotas da API do portal do cliente (web).
 */
public final class GestaoOficinaWebControllerMapping {

    private static final String API_VERSION_V1 = "/api/v1";

    public static final String HEALTH_PATH = "/api/health";

    /** Customer login — POST /api/v1/web/auth/login */
    public static final String WEB_AUTH_PATH = API_VERSION_V1 + "/web/auth";
    public static final String AUTH_LOGIN = "/login";

    /** Authenticated customer area — /api/v1/web/me/** */
    public static final String WEB_ME_PATH = API_VERSION_V1 + "/web/me";
    public static final String ME_ORDERS = "/orders";
    public static final String ME_VEHICLES = "/vehicles";
    public static final String ME_ORDER_BY_ID = "/orders/{id}";

    /** Public tracking — GET /api/v1/web/tracking */
    public static final String WEB_TRACKING_PATH = API_VERSION_V1 + "/web/tracking";

    private GestaoOficinaWebControllerMapping() {
    }
}

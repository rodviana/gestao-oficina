package com.gestaooficina.controller;

/**
 * Constantes de rotas da API do portal do cliente (web).
 */
public final class GestaoOficinaWebControllerMapping {

    private static final String API_VERSION_V1 = "/api/v1";

    public static final String HEALTH_PATH = "/api/health";

    /** Customer login screen — /login */
    public static final String WEB_AUTH_PATH = API_VERSION_V1 + "/web/auth";

    public static final String AUTH_LOGIN = "/login";

    private GestaoOficinaWebControllerMapping() {
    }
}

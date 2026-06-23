package com.gestaooficina.controller;

/**
 * Constantes de rotas da API.
 */
public final class GestaoOficinaControllerMapping {

    private static final String API_VERSION_V1 = "/api/v1";

    public static final String HEALTH_PATH = "/api/health";

    /** Login screen — /login */
    public static final String AUTH_PATH = API_VERSION_V1 + "/auth";

    /** Home screen — / */
    public static final String HOME_PATH = API_VERSION_V1 + "/home";

    public static final String ADMIN_PATH = API_VERSION_V1 + "/admin";

    public static final String AUTH_LOGIN = "/login";

    /** Admin panel screen — /admin */
    public static final String ADMIN_PANEL = "/panel";

    /** User registration screen — /admin/users/new */
    public static final String ADMIN_USERS = "/users";

    /** User list screen — /admin/users */
    public static final String ADMIN_USERS_LIST = "/users/list";

    private GestaoOficinaControllerMapping() {
    }
}

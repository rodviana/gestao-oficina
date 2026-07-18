package com.gestaooficina.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    public static final String BEARER_AUTH = "bearerAuth";

    @Bean
    public OpenAPI gestaoOficinaWebOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Workshop Customer Portal API")
                        .description(
                                "Interactive API documentation for the customer portal (web).\n\n"
                                        + "How to test protected endpoints:\n"
                                        + "1. Run POST /api/v1/web/auth/login with email/phone and password.\n"
                                        + "2. Copy the token from the response.\n"
                                        + "3. Click Authorize and enter: Bearer <token>.")
                        .version("v1")
                        .contact(new Contact()
                                .name("Workshop Management")
                                .url("http://localhost:3001")))
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT from POST /api/v1/web/auth/login")));
    }
}

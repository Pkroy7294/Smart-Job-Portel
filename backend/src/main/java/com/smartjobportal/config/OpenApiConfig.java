package com.smartjobportal.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Job Portal API")
                        .version("v1")
                        .description("Production-style REST APIs for job seekers, recruiters, and resume analysis.")
                        .contact(new Contact().name("Smart Job Portal Team").email("support@smartjobportal.local"))
                        .license(new License().name("Internal Project License")));
    }
}

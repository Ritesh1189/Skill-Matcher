package com.skillmatch.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Skill Match Job Portal API")
                        .version("1.0.0")
                        .description("Complete REST API documentation for Skill Match Job Portal built with Spring Boot, MongoDB Atlas, and React.js. Features candidate profiles, skill matching algorithm, job search & filters, application tracking, and recruiter management.")
                        .contact(new Contact()
                                .name("Skill Match Engineering Team")
                                .email("support@skillmatch.local"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development Server")
                ));
    }
}

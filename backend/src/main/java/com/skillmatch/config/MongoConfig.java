package com.skillmatch.config;

import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfig {

    @Bean
    public MongoClientSettingsBuilderCustomizer mongoClientSettingsCustomizer() {
        return clientSettingsBuilder -> clientSettingsBuilder
                .applyToClusterSettings(cluster -> cluster.serverSelectionTimeout(1500, TimeUnit.MILLISECONDS))
                .applyToSocketSettings(socket -> socket.connectTimeout(1500, TimeUnit.MILLISECONDS));
    }
}

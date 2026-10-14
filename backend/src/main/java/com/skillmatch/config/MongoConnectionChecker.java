package com.skillmatch.config;

import com.mongodb.client.MongoClient;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class MongoConnectionChecker {

    private static final Logger log = LoggerFactory.getLogger(MongoConnectionChecker.class);

    private final MongoClient mongoClient;
    private volatile boolean connected = false;

    public MongoConnectionChecker(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    @PostConstruct
    public void init() {
        checkConnection();
    }

    public synchronized boolean checkConnection() {
        try {
            mongoClient.getDatabase("admin").runCommand(new Document("ping", 1));
            connected = true;
            log.info(">> MongoDB Atlas database connection confirmed active.");
            return true;
        } catch (Exception e) {
            connected = false;
            log.warn(">> MongoDB Atlas is currently offline or unreachable ({}). Operating with resilient fast in-memory store.", e.getMessage());
            return false;
        }
    }

    public boolean isConnected() {
        return connected;
    }
}

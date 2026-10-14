package com.skillmatch.controller;

import com.skillmatch.dto.ApiResponse;
import com.skillmatch.model.Role;
import com.skillmatch.service.ApplicationService;
import com.skillmatch.service.DataInitializationService;
import com.skillmatch.service.JobService;
import com.skillmatch.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "System & Health", description = "System health check, diagnostics, and data seeding")
public class HealthController {

    private final MongoTemplate mongoTemplate;
    private final UserService userService;
    private final JobService jobService;
    private final DataInitializationService dataInitializationService;

    public HealthController(MongoTemplate mongoTemplate,
                            UserService userService,
                            JobService jobService,
                            DataInitializationService dataInitializationService) {
        this.mongoTemplate = mongoTemplate;
        this.userService = userService;
        this.jobService = jobService;
        this.dataInitializationService = dataInitializationService;
    }

    @GetMapping("/health")
    @Operation(summary = "System health check", description = "Returns system health, MongoDB Atlas status, and data counts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Skill Match Job Portal API");
        status.put("version", "1.0.0");
        status.put("timestamp", Instant.now().toString());

        // Check MongoDB connectivity
        boolean mongoConnected = false;
        try {
            mongoConnected = mongoTemplate.getDb().getName() != null;
            status.put("database", "MongoDB Atlas (Connected: " + mongoTemplate.getDb().getName() + ")");
        } catch (Exception e) {
            status.put("database", "Resilient Store (Atlas URI pending or offline)");
        }
        status.put("mongoConnected", mongoConnected);

        int candidateCount = userService.getAllCandidates().size();
        int jobsCount = jobService.getAllJobs(null, null, null, null, null).size();
        status.put("totalCandidates", candidateCount);
        status.put("totalJobs", jobsCount);

        return ResponseEntity.ok(ApiResponse.ok("System is operational", status));
    }

    @PostMapping("/seed/reset")
    @Operation(summary = "Re-seed demonstration data", description = "Restores sample candidates, recruiters, and jobs")
    public ResponseEntity<ApiResponse<String>> resetData() {
        dataInitializationService.seedInitialData();
        return ResponseEntity.ok(ApiResponse.ok("Demo data successfully synchronized", "Seeded"));
    }

    @GetMapping("/meta")
    @Operation(summary = "Project metadata & matching rule", description = "Returns technical documentation metadata and formula for viva preparation")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProjectMeta() {
        Map<String, Object> meta = new HashMap<>();
        meta.put("projectName", "Skill Match Job Portal");
        meta.put("frontend", "React.js (Vite + Modern Responsive CSS)");
        meta.put("backend", "Java Spring Boot 3.3.4 (REST API)");
        meta.put("database", "MongoDB Atlas");
        meta.put("apiDocumentation", "Swagger UI (springdoc-openapi 2.6.0)");
        meta.put("formula", "Match score = (Matched required skills / Total required skills) * 100");
        meta.put("algorithmFeatures", Arrays.asList(
                "Case-insensitive skill comparison",
                "Synonym normalization (e.g. React.js -> react, SpringBoot -> spring boot)",
                "Detailed matched vs missing breakdown",
                "Bonus skill discovery",
                "Match tiers: Strong (>=80%), Moderate (50-79%), Low (<50%)"
        ));
        return ResponseEntity.ok(ApiResponse.ok(meta));
    }
}

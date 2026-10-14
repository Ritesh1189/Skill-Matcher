package com.skillmatch.controller;

import com.skillmatch.dto.ApiResponse;
import com.skillmatch.dto.ApplicationRequest;
import com.skillmatch.model.Application;
import com.skillmatch.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Job Applications", description = "Application submission and tracking for candidates and recruiters")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @Operation(summary = "Apply for a job", description = "Submits a candidate application with auto-calculated skill match percentage and breakdown")
    public ResponseEntity<ApiResponse<Application>> apply(@Valid @RequestBody ApplicationRequest request) {
        Application application = applicationService.apply(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Application submitted successfully", application));
    }

    @GetMapping("/candidate/{candidateId}")
    @Operation(summary = "Get candidate applications", description = "Returns all jobs applied to by a candidate with current statuses")
    public ResponseEntity<ApiResponse<List<Application>>> getCandidateApplications(@PathVariable String candidateId) {
        List<Application> list = applicationService.getApplicationsByCandidate(candidateId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/job/{jobId}")
    @Operation(summary = "Get applications for a job", description = "Returns all candidate applications for a specific job listing (recruiter view)")
    public ResponseEntity<ApiResponse<List<Application>>> getJobApplications(@PathVariable String jobId) {
        List<Application> list = applicationService.getApplicationsByJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update application review status", description = "Allows recruiters to change status: APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW, REJECTED, HIRED")
    public ResponseEntity<ApiResponse<Application>> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status field is required"));
        }
        Application updated = applicationService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Status updated to " + status.toUpperCase(), updated));
    }
}

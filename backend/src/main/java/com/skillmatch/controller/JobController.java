package com.skillmatch.controller;

import com.skillmatch.dto.ApiResponse;
import com.skillmatch.dto.JobRequest;
import com.skillmatch.model.Job;
import com.skillmatch.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Job Listings", description = "Endpoints for browsing, searching, creating, and managing job postings")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    @Operation(summary = "Search and filter job listings", description = "Returns active job listings with optional filters for keyword search, location, job type, and experience level")
    public ResponseEntity<ApiResponse<List<Job>>> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) String recruiterId) {
        List<Job> jobs = jobService.getAllJobs(search, location, type, experienceLevel, recruiterId);
        return ResponseEntity.ok(ApiResponse.ok(jobs));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job details by ID", description = "Retrieves full details of a specific job listing including required and nice-to-have skills")
    public ResponseEntity<ApiResponse<Job>> getJobById(@PathVariable String id) {
        Job job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.ok(job));
    }

    @PostMapping
    @Operation(summary = "Create a new job listing", description = "Allows recruiters to post a new job with required skills and criteria")
    public ResponseEntity<ApiResponse<Job>> createJob(@Valid @RequestBody JobRequest request) {
        Job created = jobService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job listing created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing job listing", description = "Allows recruiters to update an existing job posting")
    public ResponseEntity<ApiResponse<Job>> updateJob(@PathVariable String id, @RequestBody JobRequest request) {
        Job updated = jobService.updateJob(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Job listing updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a job listing", description = "Removes a job posting")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable String id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.ok("Job deleted successfully", null));
    }

    @GetMapping("/recruiter/{recruiterId}")
    @Operation(summary = "Get jobs posted by recruiter", description = "Returns all job listings created by a specific recruiter")
    public ResponseEntity<ApiResponse<List<Job>>> getRecruiterJobs(@PathVariable String recruiterId) {
        List<Job> jobs = jobService.getJobsByRecruiter(recruiterId);
        return ResponseEntity.ok(ApiResponse.ok(jobs));
    }
}

package com.skillmatch.controller;

import com.skillmatch.dto.ApiResponse;
import com.skillmatch.dto.MatchRequest;
import com.skillmatch.model.Job;
import com.skillmatch.model.MatchResult;
import com.skillmatch.model.User;
import com.skillmatch.service.JobService;
import com.skillmatch.service.SkillMatchingService;
import com.skillmatch.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/match")
@Tag(name = "Skill Matching Engine", description = "Core matching algorithm evaluating candidate skills against job requirements")
public class MatchController {

    private final SkillMatchingService skillMatchingService;
    private final UserService userService;
    private final JobService jobService;

    public MatchController(SkillMatchingService skillMatchingService, UserService userService, JobService jobService) {
        this.skillMatchingService = skillMatchingService;
        this.userService = userService;
        this.jobService = jobService;
    }

    @PostMapping("/calculate")
    @Operation(summary = "Calculate skill match score", description = "Computes match percentage, matched skills, missing skills, and explanation based on candidate skills vs job requirements")
    public ResponseEntity<ApiResponse<MatchResult>> calculateMatch(@RequestBody MatchRequest request) {
        List<String> candidateSkills = request.getCandidateSkills();
        List<String> requiredSkills = request.getRequiredSkills();
        String jobId = request.getJobId();
        String jobTitle = "Custom Job";

        if (jobId != null && !jobId.trim().isEmpty()) {
            Job job = jobService.getJobById(jobId);
            requiredSkills = job.getRequiredSkills();
            jobTitle = job.getTitle();
        }

        if (request.getCandidateId() != null && !request.getCandidateId().trim().isEmpty()) {
            User candidate = userService.getById(request.getCandidateId());
            candidateSkills = candidate.getSkills();
        }

        MatchResult result = skillMatchingService.calculateMatch(
                jobId != null ? jobId : "custom",
                jobTitle,
                request.getCandidateId() != null ? request.getCandidateId() : "custom",
                candidateSkills,
                requiredSkills
        );

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/job/{jobId}/candidate/{candidateId}")
    @Operation(summary = "Calculate match between specific job and candidate", description = "Fetches job requirements and candidate profile to produce detailed match result")
    public ResponseEntity<ApiResponse<MatchResult>> matchJobAndCandidate(@PathVariable String jobId, @PathVariable String candidateId) {
        Job job = jobService.getJobById(jobId);
        User candidate = userService.getById(candidateId);

        MatchResult result = skillMatchingService.calculateMatch(
                job.getId(),
                job.getTitle(),
                candidate.getId(),
                candidate.getSkills(),
                job.getRequiredSkills()
        );

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/candidate/{candidateId}/jobs")
    @Operation(summary = "Get jobs ranked by match score for a candidate", description = "Scans all open job listings and orders them by highest match percentage for the candidate")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRankedJobsForCandidate(@PathVariable String candidateId) {
        User candidate = userService.getById(candidateId);
        List<Job> allJobs = jobService.getAllJobs(null, null, null, null, null);

        List<Map<String, Object>> rankedList = new ArrayList<>();
        for (Job job : allJobs) {
            MatchResult match = skillMatchingService.calculateMatch(
                    job.getId(),
                    job.getTitle(),
                    candidate.getId(),
                    candidate.getSkills(),
                    job.getRequiredSkills()
            );

            Map<String, Object> item = new HashMap<>();
            item.put("job", job);
            item.put("match", match);
            rankedList.add(item);
        }

        rankedList.sort((a, b) -> {
            MatchResult ma = (MatchResult) a.get("match");
            MatchResult mb = (MatchResult) b.get("match");
            return Double.compare(mb.getMatchPercentage(), ma.getMatchPercentage());
        });

        return ResponseEntity.ok(ApiResponse.ok(rankedList));
    }

    @GetMapping("/job/{jobId}/candidates")
    @Operation(summary = "Get candidates ranked by match score for a job", description = "Scans candidate pool and ranks candidates based on skill match percentage for recruiter review")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRankedCandidatesForJob(@PathVariable String jobId) {
        Job job = jobService.getJobById(jobId);
        List<User> candidates = userService.getAllCandidates();

        List<Map<String, Object>> rankedList = new ArrayList<>();
        for (User candidate : candidates) {
            MatchResult match = skillMatchingService.calculateMatch(
                    job.getId(),
                    job.getTitle(),
                    candidate.getId(),
                    candidate.getSkills(),
                    job.getRequiredSkills()
            );

            Map<String, Object> item = new HashMap<>();
            item.put("candidate", candidate);
            item.put("match", match);
            rankedList.add(item);
        }

        rankedList.sort((a, b) -> {
            MatchResult ma = (MatchResult) a.get("match");
            MatchResult mb = (MatchResult) b.get("match");
            return Double.compare(mb.getMatchPercentage(), ma.getMatchPercentage());
        });

        return ResponseEntity.ok(ApiResponse.ok(rankedList));
    }
}

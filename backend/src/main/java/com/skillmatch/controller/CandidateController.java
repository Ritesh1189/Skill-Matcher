package com.skillmatch.controller;

import com.skillmatch.dto.ApiResponse;
import com.skillmatch.dto.ProfileUpdateRequest;
import com.skillmatch.model.User;
import com.skillmatch.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@Tag(name = "Candidates & Profiles", description = "Candidate profile viewing, editing, and skills management")
public class CandidateController {

    private final UserService userService;

    public CandidateController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "List all candidates", description = "Retrieves all registered candidate profiles with their skills")
    public ResponseEntity<ApiResponse<List<User>>> getAllCandidates() {
        List<User> candidates = userService.getAllCandidates();
        return ResponseEntity.ok(ApiResponse.ok(candidates));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get candidate by ID", description = "Retrieves a candidate's full profile including bio, education, and skills")
    public ResponseEntity<ApiResponse<User>> getCandidateById(@PathVariable String id) {
        User user = userService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update candidate profile & skills", description = "Updates candidate profile details, bio, links, and listed skills")
    public ResponseEntity<ApiResponse<User>> updateProfile(@PathVariable String id, @RequestBody ProfileUpdateRequest request) {
        User updated = userService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}

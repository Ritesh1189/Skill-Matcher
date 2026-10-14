package com.skillmatch.controller;

import com.skillmatch.dto.ApiResponse;
import com.skillmatch.dto.AuthRequest;
import com.skillmatch.dto.AuthResponse;
import com.skillmatch.dto.RegisterRequest;
import com.skillmatch.model.User;
import com.skillmatch.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration and login for Candidates and Recruiters")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user profile as either CANDIDATE or RECRUITER")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/user/{id}")
    @Operation(summary = "Get user by ID", description = "Fetches user details by user ID")
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable String id) {
        User user = userService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}

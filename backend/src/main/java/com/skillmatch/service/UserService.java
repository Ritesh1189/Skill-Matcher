package com.skillmatch.service;

import com.skillmatch.config.MongoConnectionChecker;
import com.skillmatch.dto.AuthRequest;
import com.skillmatch.dto.AuthResponse;
import com.skillmatch.dto.ProfileUpdateRequest;
import com.skillmatch.dto.RegisterRequest;
import com.skillmatch.exception.BadRequestException;
import com.skillmatch.exception.ResourceNotFoundException;
import com.skillmatch.model.Role;
import com.skillmatch.model.User;
import com.skillmatch.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final MongoConnectionChecker mongoChecker;
    private final Map<String, User> memoryUsers = new ConcurrentHashMap<>();

    public UserService(UserRepository userRepository, MongoConnectionChecker mongoChecker) {
        this.userRepository = userRepository;
        this.mongoChecker = mongoChecker;
    }

    public AuthResponse register(RegisterRequest req) {
        if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        String cleanEmail = req.getEmail().trim().toLowerCase();

        boolean exists = false;
        if (mongoChecker.isConnected()) {
            try {
                exists = userRepository.existsByEmail(cleanEmail);
            } catch (Exception e) {
                exists = memoryUsers.values().stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(cleanEmail));
            }
        } else {
            exists = memoryUsers.values().stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(cleanEmail));
        }

        if (exists) {
            throw new BadRequestException("User with email '" + cleanEmail + "' already exists");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setName(req.getName());
        user.setEmail(cleanEmail);
        user.setPassword(req.getPassword());
        user.setRole(req.getRole());
        user.setTitle(req.getTitle());
        user.setBio(req.getBio());
        user.setLocation(req.getLocation());
        user.setSkills(req.getSkills() != null ? req.getSkills() : new ArrayList<>());
        user.setExperienceYears(req.getExperienceYears());
        user.setEducation(req.getEducation());
        user.setCompany(req.getCompany());
        user.setGithubUrl(req.getGithubUrl());
        user.setLinkedinUrl(req.getLinkedinUrl());
        user.setPortfolioUrl(req.getPortfolioUrl());

        saveUser(user);

        String dummyToken = "jwt-" + UUID.randomUUID().toString();
        return new AuthResponse(true, dummyToken, "Registration successful", user);
    }

    public AuthResponse login(AuthRequest req) {
        String cleanEmail = req.getEmail().trim().toLowerCase();
        User user = findUserByEmail(cleanEmail);

        if (user == null || !user.getPassword().equals(req.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String dummyToken = "jwt-" + UUID.randomUUID().toString();
        return new AuthResponse(true, dummyToken, "Login successful", user);
    }

    public User getById(String id) {
        User user = findUserById(id);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        return user;
    }

    public User updateProfile(String id, ProfileUpdateRequest req) {
        User user = getById(id);

        if (req.getName() != null) user.setName(req.getName());
        if (req.getTitle() != null) user.setTitle(req.getTitle());
        if (req.getBio() != null) user.setBio(req.getBio());
        if (req.getLocation() != null) user.setLocation(req.getLocation());
        if (req.getSkills() != null) user.setSkills(req.getSkills());
        if (req.getExperienceYears() != null) user.setExperienceYears(req.getExperienceYears());
        if (req.getEducation() != null) user.setEducation(req.getEducation());
        if (req.getCompany() != null) user.setCompany(req.getCompany());
        if (req.getGithubUrl() != null) user.setGithubUrl(req.getGithubUrl());
        if (req.getLinkedinUrl() != null) user.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getPortfolioUrl() != null) user.setPortfolioUrl(req.getPortfolioUrl());

        return saveUser(user);
    }

    public List<User> getAllCandidates() {
        if (mongoChecker.isConnected()) {
            try {
                List<User> list = userRepository.findByRole(Role.CANDIDATE);
                if (!list.isEmpty()) {
                    list.forEach(u -> memoryUsers.put(u.getId(), u));
                    return list;
                }
            } catch (Exception e) {
                log.warn("MongoDB lookup failed: {}", e.getMessage());
            }
        }

        return memoryUsers.values().stream()
                .filter(u -> u.getRole() == Role.CANDIDATE)
                .sorted(Comparator.comparing(User::getName))
                .toList();
    }

    public User saveUser(User user) {
        memoryUsers.put(user.getId(), user);
        if (mongoChecker.isConnected()) {
            try {
                return userRepository.save(user);
            } catch (Exception e) {
                log.warn("MongoDB save failed: {}", e.getMessage());
            }
        }
        return user;
    }

    public User findUserByEmail(String email) {
        if (mongoChecker.isConnected()) {
            try {
                Optional<User> opt = userRepository.findByEmail(email);
                if (opt.isPresent()) {
                    memoryUsers.put(opt.get().getId(), opt.get());
                    return opt.get();
                }
            } catch (Exception e) {
                log.warn("MongoDB lookup failed: {}", e.getMessage());
            }
        }

        return memoryUsers.values().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElse(null);
    }

    public User findUserById(String id) {
        if (mongoChecker.isConnected()) {
            try {
                Optional<User> opt = userRepository.findById(id);
                if (opt.isPresent()) {
                    memoryUsers.put(opt.get().getId(), opt.get());
                    return opt.get();
                }
            } catch (Exception e) {
                log.warn("MongoDB findById failed: {}", e.getMessage());
            }
        }
        return memoryUsers.get(id);
    }

    public void clearMemory() {
        memoryUsers.clear();
    }
}

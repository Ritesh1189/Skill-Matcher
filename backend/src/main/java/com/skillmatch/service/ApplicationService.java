package com.skillmatch.service;

import com.skillmatch.config.MongoConnectionChecker;
import com.skillmatch.dto.ApplicationRequest;
import com.skillmatch.exception.BadRequestException;
import com.skillmatch.exception.ResourceNotFoundException;
import com.skillmatch.model.Application;
import com.skillmatch.model.Job;
import com.skillmatch.model.MatchResult;
import com.skillmatch.model.User;
import com.skillmatch.repository.ApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private static final Logger log = LoggerFactory.getLogger(ApplicationService.class);

    private final ApplicationRepository applicationRepository;
    private final UserService userService;
    private final JobService jobService;
    private final SkillMatchingService skillMatchingService;
    private final MongoConnectionChecker mongoChecker;

    private final Map<String, Application> memoryApplications = new ConcurrentHashMap<>();

    public ApplicationService(ApplicationRepository applicationRepository,
                              UserService userService,
                              JobService jobService,
                              SkillMatchingService skillMatchingService,
                              MongoConnectionChecker mongoChecker) {
        this.applicationRepository = applicationRepository;
        this.userService = userService;
        this.jobService = jobService;
        this.skillMatchingService = skillMatchingService;
        this.mongoChecker = mongoChecker;
    }

    public Application apply(ApplicationRequest req) {
        User candidate = userService.getById(req.getCandidateId());
        Job job = jobService.getJobById(req.getJobId());

        boolean alreadyApplied = false;
        if (mongoChecker.isConnected()) {
            try {
                alreadyApplied = applicationRepository.existsByJobIdAndCandidateId(job.getId(), candidate.getId());
            } catch (Exception e) {
                alreadyApplied = memoryApplications.values().stream()
                        .anyMatch(a -> a.getJobId().equals(job.getId()) && a.getCandidateId().equals(candidate.getId()));
            }
        } else {
            alreadyApplied = memoryApplications.values().stream()
                    .anyMatch(a -> a.getJobId().equals(job.getId()) && a.getCandidateId().equals(candidate.getId()));
        }

        if (alreadyApplied) {
            throw new BadRequestException("You have already applied for the position: " + job.getTitle());
        }

        MatchResult match = skillMatchingService.calculateMatch(
                job.getId(),
                job.getTitle(),
                candidate.getId(),
                candidate.getSkills(),
                job.getRequiredSkills()
        );

        Application app = new Application();
        app.setId(UUID.randomUUID().toString());
        app.setJobId(job.getId());
        app.setJobTitle(job.getTitle());
        app.setCompany(job.getCompany());
        app.setCandidateId(candidate.getId());
        app.setCandidateName(candidate.getName());
        app.setCandidateEmail(candidate.getEmail());
        app.setCandidateTitle(candidate.getTitle());
        app.setMatchScore(match.getMatchPercentage());
        app.setMatchedSkills(match.getMatchedSkills());
        app.setMissingSkills(match.getMissingSkills());
        app.setCoverNote(req.getCoverNote());
        app.setStatus("APPLIED");
        app.setAppliedAt(Instant.now());
        app.setUpdatedAt(Instant.now());

        jobService.incrementApplicantsCount(job.getId());

        return saveApplication(app);
    }

    public List<Application> getApplicationsByCandidate(String candidateId) {
        if (mongoChecker.isConnected()) {
            try {
                List<Application> list = applicationRepository.findByCandidateId(candidateId);
                if (!list.isEmpty()) {
                    list.forEach(a -> memoryApplications.put(a.getId(), a));
                    return list;
                }
            } catch (Exception e) {
                log.warn("MongoDB lookup failed: {}", e.getMessage());
            }
        }

        return memoryApplications.values().stream()
                .filter(a -> a.getCandidateId().equals(candidateId))
                .sorted(Comparator.comparing(Application::getAppliedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public List<Application> getApplicationsByJob(String jobId) {
        if (mongoChecker.isConnected()) {
            try {
                List<Application> list = applicationRepository.findByJobId(jobId);
                if (!list.isEmpty()) {
                    list.forEach(a -> memoryApplications.put(a.getId(), a));
                    return list;
                }
            } catch (Exception e) {
                log.warn("MongoDB lookup failed: {}", e.getMessage());
            }
        }

        return memoryApplications.values().stream()
                .filter(a -> a.getJobId().equals(jobId))
                .sorted(Comparator.comparing(Application::getMatchScore, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public Application updateStatus(String applicationId, String newStatus) {
        Application app = findApplicationById(applicationId);
        if (app == null) {
            throw new ResourceNotFoundException("Application not found with id: " + applicationId);
        }

        app.setStatus(newStatus.toUpperCase());
        app.setUpdatedAt(Instant.now());

        return saveApplication(app);
    }

    public Application saveApplication(Application app) {
        memoryApplications.put(app.getId(), app);
        if (mongoChecker.isConnected()) {
            try {
                return applicationRepository.save(app);
            } catch (Exception e) {
                log.warn("MongoDB save skipped/failed, saved to memory: {}", e.getMessage());
            }
        }
        return app;
    }

    public Application findApplicationById(String id) {
        if (mongoChecker.isConnected()) {
            try {
                Optional<Application> opt = applicationRepository.findById(id);
                if (opt.isPresent()) {
                    memoryApplications.put(opt.get().getId(), opt.get());
                    return opt.get();
                }
            } catch (Exception e) {
                log.warn("MongoDB findById failed: {}", e.getMessage());
            }
        }
        return memoryApplications.get(id);
    }
}

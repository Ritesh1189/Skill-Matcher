package com.skillmatch.service;

import com.skillmatch.config.MongoConnectionChecker;
import com.skillmatch.dto.JobRequest;
import com.skillmatch.exception.ResourceNotFoundException;
import com.skillmatch.model.Job;
import com.skillmatch.repository.JobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class JobService {

    private static final Logger log = LoggerFactory.getLogger(JobService.class);

    private final JobRepository jobRepository;
    private final MongoConnectionChecker mongoChecker;
    private final Map<String, Job> memoryJobs = new ConcurrentHashMap<>();

    public JobService(JobRepository jobRepository, MongoConnectionChecker mongoChecker) {
        this.jobRepository = jobRepository;
        this.mongoChecker = mongoChecker;
    }

    public Job createJob(JobRequest req) {
        Job job = new Job();
        job.setId(UUID.randomUUID().toString());
        job.setTitle(req.getTitle());
        job.setCompany(req.getCompany());
        job.setLocation(req.getLocation());
        job.setType(req.getType() != null ? req.getType() : "Full-time");
        job.setExperienceLevel(req.getExperienceLevel() != null ? req.getExperienceLevel() : "Mid Level");
        job.setSalaryRange(req.getSalaryRange());
        job.setDescription(req.getDescription());
        job.setRequiredSkills(req.getRequiredSkills() != null ? req.getRequiredSkills() : new ArrayList<>());
        job.setNiceToHaveSkills(req.getNiceToHaveSkills() != null ? req.getNiceToHaveSkills() : new ArrayList<>());
        job.setRecruiterId(req.getRecruiterId());
        job.setRecruiterEmail(req.getRecruiterEmail());
        job.setRecruiterName(req.getRecruiterName());
        job.setStatus("OPEN");
        job.setCreatedAt(Instant.now());
        job.setUpdatedAt(Instant.now());

        return saveJob(job);
    }

    public Job updateJob(String id, JobRequest req) {
        Job job = getJobById(id);

        if (req.getTitle() != null) job.setTitle(req.getTitle());
        if (req.getCompany() != null) job.setCompany(req.getCompany());
        if (req.getLocation() != null) job.setLocation(req.getLocation());
        if (req.getType() != null) job.setType(req.getType());
        if (req.getExperienceLevel() != null) job.setExperienceLevel(req.getExperienceLevel());
        if (req.getSalaryRange() != null) job.setSalaryRange(req.getSalaryRange());
        if (req.getDescription() != null) job.setDescription(req.getDescription());
        if (req.getRequiredSkills() != null) job.setRequiredSkills(req.getRequiredSkills());
        if (req.getNiceToHaveSkills() != null) job.setNiceToHaveSkills(req.getNiceToHaveSkills());
        job.setUpdatedAt(Instant.now());

        return saveJob(job);
    }

    public void deleteJob(String id) {
        Job job = getJobById(id);
        memoryJobs.remove(id);
        if (mongoChecker.isConnected()) {
            try {
                jobRepository.deleteById(id);
            } catch (Exception e) {
                log.warn("MongoDB delete skipped/failed: {}", e.getMessage());
            }
        }
    }

    public Job getJobById(String id) {
        Job job = findJobById(id);
        if (job == null) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        return job;
    }

    public List<Job> getAllJobs(String search, String location, String type, String experienceLevel, String recruiterId) {
        List<Job> all = fetchAll();

        return all.stream()
                .filter(job -> {
                    if (recruiterId != null && !recruiterId.trim().isEmpty()) {
                        if (job.getRecruiterId() == null || !job.getRecruiterId().equals(recruiterId)) {
                            return false;
                        }
                    }
                    if (search != null && !search.trim().isEmpty()) {
                        String s = search.toLowerCase().trim();
                        boolean matchesTitle = job.getTitle() != null && job.getTitle().toLowerCase().contains(s);
                        boolean matchesCompany = job.getCompany() != null && job.getCompany().toLowerCase().contains(s);
                        boolean matchesSkill = job.getRequiredSkills() != null && job.getRequiredSkills().stream()
                                .anyMatch(sk -> sk.toLowerCase().contains(s));
                        boolean matchesDesc = job.getDescription() != null && job.getDescription().toLowerCase().contains(s);
                        if (!matchesTitle && !matchesCompany && !matchesSkill && !matchesDesc) {
                            return false;
                        }
                    }
                    if (location != null && !location.trim().isEmpty()) {
                        if (job.getLocation() == null || !job.getLocation().toLowerCase().contains(location.toLowerCase().trim())) {
                            return false;
                        }
                    }
                    if (type != null && !type.trim().isEmpty() && !type.equalsIgnoreCase("All")) {
                        if (job.getType() == null || !job.getType().equalsIgnoreCase(type.trim())) {
                            return false;
                        }
                    }
                    if (experienceLevel != null && !experienceLevel.trim().isEmpty() && !experienceLevel.equalsIgnoreCase("All")) {
                        if (job.getExperienceLevel() == null || !job.getExperienceLevel().equalsIgnoreCase(experienceLevel.trim())) {
                            return false;
                        }
                    }
                    return true;
                })
                .sorted(Comparator.comparing(Job::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public List<Job> getJobsByRecruiter(String recruiterId) {
        return getAllJobs(null, null, null, null, recruiterId);
    }

    public void incrementApplicantsCount(String jobId) {
        try {
            Job job = getJobById(jobId);
            job.setApplicantsCount(job.getApplicantsCount() + 1);
            saveJob(job);
        } catch (Exception e) {
            log.warn("Failed to increment applicant count for job {}: {}", jobId, e.getMessage());
        }
    }

    public Job saveJob(Job job) {
        memoryJobs.put(job.getId(), job);
        if (mongoChecker.isConnected()) {
            try {
                return jobRepository.save(job);
            } catch (Exception e) {
                log.warn("MongoDB save skipped/failed, saved to memory: {}", e.getMessage());
            }
        }
        return job;
    }

    private List<Job> fetchAll() {
        if (mongoChecker.isConnected()) {
            try {
                List<Job> list = jobRepository.findAll();
                if (!list.isEmpty()) {
                    list.forEach(j -> memoryJobs.put(j.getId(), j));
                    return list;
                }
            } catch (Exception e) {
                log.warn("MongoDB fetch all failed: {}", e.getMessage());
            }
        }
        return new ArrayList<>(memoryJobs.values());
    }

    private Job findJobById(String id) {
        if (mongoChecker.isConnected()) {
            try {
                Optional<Job> opt = jobRepository.findById(id);
                if (opt.isPresent()) {
                    memoryJobs.put(opt.get().getId(), opt.get());
                    return opt.get();
                }
            } catch (Exception e) {
                log.warn("MongoDB findById failed: {}", e.getMessage());
            }
        }
        return memoryJobs.get(id);
    }
}

package com.skillmatch.service;

import com.skillmatch.dto.JobRequest;
import com.skillmatch.model.Job;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializationService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializationService.class);

    private final JobService jobService;

    public DataInitializationService(JobService jobService) {
        this.jobService = jobService;
    }

    @Override
    public void run(String... args) {
        seedInitialData();
    }

    public synchronized void seedInitialData() {
        log.info("Checking and seeding Skill Match Job Portal job openings...");

        // Seed realistic job postings without dummy candidate profiles
        List<Job> existingJobs = jobService.getAllJobs(null, null, null, null, null);
        if (existingJobs.isEmpty()) {
            // Job 1: Junior Full-Stack Developer
            JobRequest job1 = new JobRequest();
            job1.setTitle("Junior Full-Stack Developer");
            job1.setCompany("CloudScale Technologies");
            job1.setLocation("San Francisco, CA (Hybrid)");
            job1.setType("Full-time");
            job1.setExperienceLevel("Entry Level");
            job1.setSalaryRange("$75,000 - $95,000 / yr");
            job1.setDescription("We are seeking an enthusiastic Junior Full-Stack Developer to work across our Spring Boot REST services and modern React user interface. You will collaborate on core product features, write clean maintainable code, and participate in code reviews.");
            job1.setRequiredSkills(Arrays.asList("Java", "React", "SQL", "Git"));
            job1.setNiceToHaveSkills(Arrays.asList("Spring Boot", "Docker", "REST APIs"));
            job1.setRecruiterEmail("careers@cloudscale.io");
            job1.setRecruiterName("CloudScale Hiring Team");
            jobService.createJob(job1);

            // Job 2: Senior Java & Spring Boot Engineer
            JobRequest job2 = new JobRequest();
            job2.setTitle("Senior Java & Spring Boot Engineer");
            job2.setCompany("CloudScale Technologies");
            job2.setLocation("Remote");
            job2.setType("Full-time");
            job2.setExperienceLevel("Senior");
            job2.setSalaryRange("$135,000 - $165,000 / yr");
            job2.setDescription("Architect high-throughput microservices using Java 17/21 and Spring Boot. Design data models in MongoDB Atlas, implement RESTful interfaces, and ensure high availability in Kubernetes.");
            job2.setRequiredSkills(Arrays.asList("Java", "Spring Boot", "MongoDB", "REST APIs", "Docker"));
            job2.setNiceToHaveSkills(Arrays.asList("Kubernetes", "Kafka", "AWS"));
            job2.setRecruiterEmail("careers@cloudscale.io");
            job2.setRecruiterName("CloudScale Hiring Team");
            jobService.createJob(job2);

            // Job 3: Frontend React Engineer
            JobRequest job3 = new JobRequest();
            job3.setTitle("Frontend React Developer");
            job3.setCompany("Nexus Software Labs");
            job3.setLocation("New York, NY (Remote)");
            job3.setType("Full-time");
            job3.setExperienceLevel("Mid Level");
            job3.setSalaryRange("$100,000 - $125,000 / yr");
            job3.setDescription("Create beautiful, fluid interactive interfaces with React and TypeScript. Work closely with product designers to implement responsive component libraries and micro-interactions.");
            job3.setRequiredSkills(Arrays.asList("React", "TypeScript", "JavaScript", "REST APIs", "Git"));
            job3.setNiceToHaveSkills(Arrays.asList("Tailwind CSS", "Redux", "Jest"));
            job3.setRecruiterEmail("talent@nexuslabs.com");
            job3.setRecruiterName("Nexus Talent Acquisition");
            jobService.createJob(job3);

            // Job 4: Cloud & DevOps Engineer
            JobRequest job4 = new JobRequest();
            job4.setTitle("Cloud DevOps & Infrastructure Engineer");
            job4.setCompany("Nexus Software Labs");
            job4.setLocation("Austin, TX (Hybrid)");
            job4.setType("Contract");
            job4.setExperienceLevel("Senior");
            job4.setSalaryRange("$120,000 - $150,000 / yr");
            job4.setDescription("Maintain automated CI/CD pipelines, containerize microservices with Docker, and orchestrate clusters on AWS. Oversee cloud security and monitoring.");
            job4.setRequiredSkills(Arrays.asList("AWS", "Docker", "Kubernetes", "CI/CD", "Linux"));
            job4.setNiceToHaveSkills(Arrays.asList("Terraform", "Python", "Prometheus"));
            job4.setRecruiterEmail("talent@nexuslabs.com");
            job4.setRecruiterName("Nexus Talent Acquisition");
            jobService.createJob(job4);

            // Job 5: Full Stack Software Engineering Intern
            JobRequest job5 = new JobRequest();
            job5.setTitle("Full Stack Software Engineering Intern");
            job5.setCompany("CloudScale Technologies");
            job5.setLocation("San Francisco, CA");
            job5.setType("Internship");
            job5.setExperienceLevel("Entry Level");
            job5.setSalaryRange("$35 - $45 / hour");
            job5.setDescription("Exciting opportunity for students or recent graduates to learn Spring Boot and React on production services with direct mentorship from senior engineers.");
            job5.setRequiredSkills(Arrays.asList("Java", "JavaScript", "Git"));
            job5.setNiceToHaveSkills(Arrays.asList("React", "Spring Boot", "SQL"));
            job5.setRecruiterEmail("careers@cloudscale.io");
            job5.setRecruiterName("CloudScale Hiring Team");
            jobService.createJob(job5);

            log.info("Successfully seeded clean job openings.");
        }
    }
}

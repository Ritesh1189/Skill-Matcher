package com.skillmatch.service;

import com.skillmatch.dto.ApplicationRequest;
import com.skillmatch.dto.JobRequest;
import com.skillmatch.dto.RegisterRequest;
import com.skillmatch.model.Job;
import com.skillmatch.model.Role;
import com.skillmatch.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializationService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializationService.class);

    private final UserService userService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    public DataInitializationService(UserService userService, JobService jobService, ApplicationService applicationService) {
        this.userService = userService;
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @Override
    public void run(String... args) {
        seedInitialData();
    }

    public synchronized void seedInitialData() {
        log.info("Checking and seeding Skill Match Job Portal initial demonstration data...");

        // 1. Seed Candidates
        User alex = null;
        try {
            alex = userService.findUserByEmail("alex.morgan@example.com");
        } catch (Exception ignored) {}

        if (alex == null) {
            RegisterRequest alexReq = new RegisterRequest();
            alexReq.setName("Alex Morgan");
            alexReq.setEmail("alex.morgan@example.com");
            alexReq.setPassword("password123");
            alexReq.setRole(Role.CANDIDATE);
            alexReq.setTitle("Full Stack Developer");
            alexReq.setLocation("San Francisco, CA");
            alexReq.setBio("Passionate full stack engineer building responsive web apps with Spring Boot, React, and MongoDB.");
            alexReq.setSkills(Arrays.asList("Java", "Spring Boot", "React", "MongoDB", "REST APIs", "Git", "Docker"));
            alexReq.setExperienceYears(3);
            alexReq.setEducation("B.S. in Computer Science, UC Berkeley");
            alexReq.setGithubUrl("https://github.com/alexmorgan-demo");
            alexReq.setLinkedinUrl("https://linkedin.com/in/alexmorgan-demo");
            alex = userService.register(alexReq).getUser();
        }

        User sarah = null;
        try {
            sarah = userService.findUserByEmail("sarah.chen@example.com");
        } catch (Exception ignored) {}

        if (sarah == null) {
            RegisterRequest sarahReq = new RegisterRequest();
            sarahReq.setName("Sarah Chen");
            sarahReq.setEmail("sarah.chen@example.com");
            sarahReq.setPassword("password123");
            sarahReq.setRole(Role.CANDIDATE);
            sarahReq.setTitle("Senior Frontend Engineer");
            sarahReq.setLocation("New York, NY");
            sarahReq.setBio("UI/UX focused engineer specializing in React, TypeScript, and modern component design systems.");
            sarahReq.setSkills(Arrays.asList("React", "TypeScript", "JavaScript", "Redux", "Tailwind CSS", "Figma", "REST APIs", "Git"));
            sarahReq.setExperienceYears(5);
            sarahReq.setEducation("M.S. in Software Engineering, NYU");
            sarahReq.setGithubUrl("https://github.com/sarahchen-demo");
            sarahReq.setLinkedinUrl("https://linkedin.com/in/sarahchen-demo");
            sarah = userService.register(sarahReq).getUser();
        }

        User david = null;
        try {
            david = userService.findUserByEmail("david.kim@example.com");
        } catch (Exception ignored) {}

        if (david == null) {
            RegisterRequest davidReq = new RegisterRequest();
            davidReq.setName("David Kim");
            davidReq.setEmail("david.kim@example.com");
            davidReq.setPassword("password123");
            davidReq.setRole(Role.CANDIDATE);
            davidReq.setTitle("Backend & Cloud Specialist");
            davidReq.setLocation("Austin, TX");
            davidReq.setBio("Distributed systems builder with strong experience in Spring Boot microservices, Kafka, and AWS cloud.");
            davidReq.setSkills(Arrays.asList("Java", "Spring Boot", "SQL", "PostgreSQL", "Kafka", "AWS", "Docker", "Kubernetes", "Git"));
            davidReq.setExperienceYears(4);
            davidReq.setEducation("B.S. in Information Systems, UT Austin");
            davidReq.setGithubUrl("https://github.com/davidkim-demo");
            davidReq.setLinkedinUrl("https://linkedin.com/in/davidkim-demo");
            david = userService.register(davidReq).getUser();
        }

        // 2. Seed Recruiters
        User emma = null;
        try {
            emma = userService.findUserByEmail("emma.recruiter@cloudscale.io");
        } catch (Exception ignored) {}

        if (emma == null) {
            RegisterRequest emmaReq = new RegisterRequest();
            emmaReq.setName("Emma Watson");
            emmaReq.setEmail("emma.recruiter@cloudscale.io");
            emmaReq.setPassword("recruiter123");
            emmaReq.setRole(Role.RECRUITER);
            emmaReq.setTitle("Lead Technical Talent Partner");
            emmaReq.setCompany("CloudScale Technologies");
            emmaReq.setLocation("San Francisco, CA");
            emmaReq.setBio("Helping high-growth engineering teams hire exceptional full stack and backend engineers.");
            emma = userService.register(emmaReq).getUser();
        }

        User michael = null;
        try {
            michael = userService.findUserByEmail("michael.hr@nexustech.com");
        } catch (Exception ignored) {}

        if (michael == null) {
            RegisterRequest michaelReq = new RegisterRequest();
            michaelReq.setName("Michael Scott");
            michaelReq.setEmail("michael.hr@nexustech.com");
            michaelReq.setPassword("recruiter123");
            michaelReq.setRole(Role.RECRUITER);
            michaelReq.setTitle("Head of Talent Acquisition");
            michaelReq.setCompany("Nexus Software Labs");
            michaelReq.setLocation("Remote");
            michaelReq.setBio("Scaling remote-first engineering teams with passionate developers.");
            michael = userService.register(michaelReq).getUser();
        }

        // 3. Seed Jobs
        List<Job> existingJobs = jobService.getAllJobs(null, null, null, null, null);
        if (existingJobs.isEmpty()) {
            // Job 1: Exactly matching PDF illustrative example (Java, SQL, React, Git)
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
            job1.setRecruiterId(emma.getId());
            job1.setRecruiterEmail(emma.getEmail());
            job1.setRecruiterName(emma.getName());
            Job createdJob1 = jobService.createJob(job1);

            // Job 2: Senior Spring Boot Engineer
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
            job2.setRecruiterId(emma.getId());
            job2.setRecruiterEmail(emma.getEmail());
            job2.setRecruiterName(emma.getName());
            Job createdJob2 = jobService.createJob(job2);

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
            job3.setRecruiterId(michael.getId());
            job3.setRecruiterEmail(michael.getEmail());
            job3.setRecruiterName(michael.getName());
            Job createdJob3 = jobService.createJob(job3);

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
            job4.setRecruiterId(michael.getId());
            job4.setRecruiterEmail(michael.getEmail());
            job4.setRecruiterName(michael.getName());
            Job createdJob4 = jobService.createJob(job4);

            // Job 5: Full Stack Web Developer (Internship)
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
            job5.setRecruiterId(emma.getId());
            job5.setRecruiterEmail(emma.getEmail());
            job5.setRecruiterName(emma.getName());
            Job createdJob5 = jobService.createJob(job5);

            // 4. Seed initial applications with match calculations
            try {
                if (alex != null && createdJob1 != null) {
                    ApplicationRequest app1 = new ApplicationRequest(createdJob1.getId(), alex.getId(),
                            "I have hands-on experience building full-stack projects with Java and React. Looking forward to discussing how my skills match the team!");
                    applicationService.apply(app1);
                }
                if (sarah != null && createdJob3 != null) {
                    ApplicationRequest app2 = new ApplicationRequest(createdJob3.getId(), sarah.getId(),
                            "I have 5+ years specializing in React and TypeScript architectures. Excited to contribute to Nexus's front-end experience!");
                    applicationService.apply(app2);
                }
                if (alex != null && createdJob2 != null) {
                    ApplicationRequest app3 = new ApplicationRequest(createdJob2.getId(), alex.getId(),
                            "Strong background in Spring Boot REST APIs and MongoDB Atlas database design.");
                    applicationService.apply(app3);
                }
            } catch (Exception e) {
                log.warn("Application seed completed with note: {}", e.getMessage());
            }

            log.info("Successfully seeded candidates, recruiters, jobs, and initial applications.");
        }
    }
}

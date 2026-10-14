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
        log.info("Checking and seeding Skill Match Job Portal Indian employers and job openings...");

        List<Job> existingJobs = jobService.getAllJobs(null, null, null, null, null);
        if (existingJobs.isEmpty()) {
            // Job 1: TCS (Tata Consultancy Services) - Bengaluru
            JobRequest job1 = new JobRequest();
            job1.setTitle("Junior Java Full-Stack Developer");
            job1.setCompany("Tata Consultancy Services (TCS)");
            job1.setLocation("Bengaluru, Karnataka (Hybrid)");
            job1.setType("Full-time");
            job1.setExperienceLevel("Entry Level");
            job1.setSalaryRange("\u20B94.5 - \u20B97.0 LPA");
            job1.setDescription("Join TCS Digital Engineering unit in Whitefield, Bengaluru. Work on enterprise Spring Boot REST microservices and modern React frontend workflows. Collaborate with agile development teams, write clean Java code, and implement responsive UI components.");
            job1.setRequiredSkills(Arrays.asList("Java", "React", "SQL", "Git"));
            job1.setNiceToHaveSkills(Arrays.asList("Spring Boot", "Docker", "REST APIs"));
            job1.setRecruiterEmail("careers@tcs.com");
            job1.setRecruiterName("TCS Talent Acquisition");
            jobService.createJob(job1);

            // Job 2: Infosys Technologies - Hyderabad
            JobRequest job2 = new JobRequest();
            job2.setTitle("Senior Java & Spring Boot Architect");
            job2.setCompany("Infosys Technologies");
            job2.setLocation("Hyderabad, Telangana (Hybrid)");
            job2.setType("Full-time");
            job2.setExperienceLevel("Senior");
            job2.setSalaryRange("\u20B918.0 - \u20B926.0 LPA");
            job2.setDescription("Architect high-throughput financial and cloud microservices using Java 17/21 and Spring Boot at Infosys Gachibowli campus, Hyderabad. Design resilient data models in MongoDB Atlas and lead distributed systems deployments on Kubernetes.");
            job2.setRequiredSkills(Arrays.asList("Java", "Spring Boot", "MongoDB", "REST APIs", "Docker"));
            job2.setNiceToHaveSkills(Arrays.asList("Kubernetes", "Kafka", "AWS"));
            job2.setRecruiterEmail("careers@infosys.com");
            job2.setRecruiterName("Infosys Engineering Hiring");
            jobService.createJob(job2);

            // Job 3: Swiggy Labs - Bengaluru
            JobRequest job3 = new JobRequest();
            job3.setTitle("Frontend React Developer");
            job3.setCompany("Swiggy Labs");
            job3.setLocation("Bengaluru, Karnataka");
            job3.setType("Full-time");
            job3.setExperienceLevel("Mid Level");
            job3.setSalaryRange("\u20B914.0 - \u20B920.0 LPA");
            job3.setDescription("Build lightning-fast, high-converting customer-facing web applications at Swiggy HQ in Bengaluru. Partner with product designers and backend engineers to craft responsive, accessible interfaces in React, TypeScript, and modern state architectures.");
            job3.setRequiredSkills(Arrays.asList("React", "TypeScript", "JavaScript", "REST APIs", "Git"));
            job3.setNiceToHaveSkills(Arrays.asList("Tailwind CSS", "Redux", "Jest"));
            job3.setRecruiterEmail("tech-jobs@swiggy.in");
            job3.setRecruiterName("Swiggy Tech Recruitment");
            jobService.createJob(job3);

            // Job 4: Zomato Media - Gurugram, Delhi NCR
            JobRequest job4 = new JobRequest();
            job4.setTitle("Cloud DevOps & Site Reliability Engineer");
            job4.setCompany("Zomato Media");
            job4.setLocation("Gurugram, Delhi NCR (Hybrid)");
            job4.setType("Full-time");
            job4.setExperienceLevel("Senior");
            job4.setSalaryRange("\u20B916.0 - \u20B924.0 LPA");
            job4.setDescription("Manage high-scale containerized infrastructure handling millions of daily food orders at Zomato Gurugram. Optimize CI/CD pipelines, orchestrate Kubernetes clusters, oversee AWS cloud security, and maintain 99.99% system availability.");
            job4.setRequiredSkills(Arrays.asList("AWS", "Docker", "Kubernetes", "CI/CD", "Linux"));
            job4.setNiceToHaveSkills(Arrays.asList("Terraform", "Python", "Prometheus"));
            job4.setRecruiterEmail("talent@zomato.com");
            job4.setRecruiterName("Zomato People Operations");
            jobService.createJob(job4);

            // Job 5: Razorpay Software - Bengaluru
            JobRequest job5 = new JobRequest();
            job5.setTitle("Full Stack Software Engineering Intern");
            job5.setCompany("Razorpay Software");
            job5.setLocation("Bengaluru, Karnataka");
            job5.setType("Internship");
            job5.setExperienceLevel("Entry Level");
            job5.setSalaryRange("\u20B935,000 - \u20B950,000 / month");
            job5.setDescription("Fast-track fintech internship at Razorpay Koramangala office in Bengaluru. Hands-on learning with Spring Boot microservices, React web architecture, and payment gateways with direct 1-on-1 mentorship from senior staff engineers.");
            job5.setRequiredSkills(Arrays.asList("Java", "JavaScript", "Git"));
            job5.setNiceToHaveSkills(Arrays.asList("React", "Spring Boot", "SQL"));
            job5.setRecruiterEmail("campus@razorpay.com");
            job5.setRecruiterName("Razorpay Campus Hiring");
            jobService.createJob(job5);

            // Job 6: Flipkart Internet - Pune
            JobRequest job6 = new JobRequest();
            job6.setTitle("Backend Microservices Engineer");
            job6.setCompany("Flipkart Internet");
            job6.setLocation("Pune, Maharashtra (Hybrid)");
            job6.setType("Full-time");
            job6.setExperienceLevel("Mid Level");
            job6.setSalaryRange("\u20B912.0 - \u20B917.5 LPA");
            job6.setDescription("Scale e-commerce checkout and inventory backends at Flipkart Pune tech hub. Develop high-performance Spring Boot services, integrate Redis caching and MongoDB Atlas databases, and ensure sub-50ms latency.");
            job6.setRequiredSkills(Arrays.asList("Java", "Spring Boot", "SQL", "MongoDB", "Git"));
            job6.setNiceToHaveSkills(Arrays.asList("Kafka", "Docker", "REST APIs"));
            job6.setRecruiterEmail("jobs@flipkart.com");
            job6.setRecruiterName("Flipkart Talent Team");
            jobService.createJob(job6);

            // Job 7: Jio Platforms - Navi Mumbai
            JobRequest job7 = new JobRequest();
            job7.setTitle("Full-Stack Developer (MERN & Java)");
            job7.setCompany("Jio Platforms");
            job7.setLocation("Navi Mumbai, Maharashtra");
            job7.setType("Full-time");
            job7.setExperienceLevel("Mid Level");
            job7.setSalaryRange("\u20B910.0 - \u20B915.0 LPA");
            job7.setDescription("Build next-generation digital services for 450M+ users at Reliance Corporate Park in Navi Mumbai. Work across React frontends and Java/Spring Boot microservices.");
            job7.setRequiredSkills(Arrays.asList("Java", "React", "MongoDB", "REST APIs", "Git"));
            job7.setNiceToHaveSkills(Arrays.asList("Docker", "TypeScript", "SQL"));
            job7.setRecruiterEmail("talent@jio.com");
            job7.setRecruiterName("Jio Tech Recruitment");
            jobService.createJob(job7);

            // Job 8: Wipro Technologies - Chennai
            JobRequest job8 = new JobRequest();
            job8.setTitle("Cloud Infrastructure Specialist");
            job8.setCompany("Wipro Technologies");
            job8.setLocation("Chennai, Tamil Nadu (Hybrid)");
            job8.setType("Full-time");
            job8.setExperienceLevel("Mid Level");
            job8.setSalaryRange("\u20B98.0 - \u20B912.0 LPA");
            job8.setDescription("Support enterprise cloud migration projects at Wipro Sholinganallur facility in Chennai. Implement infrastructure automation, configure AWS VPCs, and manage Linux container workloads.");
            job8.setRequiredSkills(Arrays.asList("AWS", "Linux", "Docker", "Git"));
            job8.setNiceToHaveSkills(Arrays.asList("Kubernetes", "CI/CD", "Python"));
            job8.setRecruiterEmail("careers@wipro.com");
            job8.setRecruiterName("Wipro Talent Acquisition");
            jobService.createJob(job8);

            log.info("Successfully seeded Indian employers and job openings in INR (LPA).");
        }
    }
}

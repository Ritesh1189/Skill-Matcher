package com.skillmatch;

import com.skillmatch.dto.JobRequest;
import com.skillmatch.model.Job;
import com.skillmatch.service.JobService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JobControllerTest {

    @Autowired
    private JobService jobService;

    @Test
    @DisplayName("Should create, retrieve and filter job listings successfully")
    void testCreateAndFilterJobs() {
        JobRequest req = new JobRequest();
        req.setTitle("React Native Mobile Engineer");
        req.setCompany("AppWorks Inc");
        req.setLocation("Remote");
        req.setType("Full-time");
        req.setExperienceLevel("Mid Level");
        req.setSalaryRange("$110,000 - $130,000");
        req.setDescription("Build high-performance cross platform mobile applications");
        req.setRequiredSkills(Arrays.asList("React Native", "TypeScript", "Redux"));
        req.setRecruiterEmail("recruiter@appworks.com");

        Job created = jobService.createJob(req);
        assertNotNull(created.getId());
        assertEquals("React Native Mobile Engineer", created.getTitle());

        Job fetched = jobService.getJobById(created.getId());
        assertEquals("AppWorks Inc", fetched.getCompany());

        List<Job> filtered = jobService.getAllJobs("Mobile", null, null, null, null);
        assertTrue(filtered.stream().anyMatch(j -> j.getId().equals(created.getId())));
    }
}

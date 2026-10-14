package com.skillmatch;

import com.skillmatch.model.MatchResult;
import com.skillmatch.service.SkillMatchingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SkillMatchingServiceTest {

    private SkillMatchingService matchingService;

    @BeforeEach
    void setUp() {
        matchingService = new SkillMatchingService();
    }

    @Test
    @DisplayName("Should reproduce exact illustrative example from project documentation: 3 of 4 skills matches 75.0%")
    void testIllustrativeExampleFromDocumentation() {
        // Job requires: Java, React, SQL, Git
        List<String> required = Arrays.asList("Java", "React", "SQL", "Git");
        // Candidate has: Java, React, Git
        List<String> candidateSkills = Arrays.asList("Java", "React", "Git");

        MatchResult result = matchingService.calculateMatch("job-1", "Junior Full-Stack Developer", "cand-1", candidateSkills, required);

        assertEquals(75.0, result.getMatchPercentage());
        assertEquals(3, result.getMatchedCount());
        assertEquals(4, result.getTotalRequiredCount());
        assertEquals(3, result.getMatchedSkills().size());
        assertTrue(result.getMatchedSkills().contains("Java"));
        assertTrue(result.getMatchedSkills().contains("React"));
        assertTrue(result.getMatchedSkills().contains("Git"));

        assertEquals(1, result.getMissingSkills().size());
        assertTrue(result.getMissingSkills().contains("SQL"));
        assertEquals("Moderate Match", result.getTier());
        assertTrue(result.getExplanation().contains("75.0%"));
    }

    @Test
    @DisplayName("Should return 100% Strong Match when candidate has all required skills")
    void testFullMatch() {
        List<String> required = Arrays.asList("Java", "Spring Boot", "MongoDB");
        List<String> candidateSkills = Arrays.asList("Java", "Spring Boot", "MongoDB", "Docker", "AWS");

        MatchResult result = matchingService.calculateMatch("job-2", "Java Engineer", "cand-2", candidateSkills, required);

        assertEquals(100.0, result.getMatchPercentage());
        assertEquals("Strong Match", result.getTier());
        assertEquals(0, result.getMissingSkills().size());
        assertEquals(2, result.getAdditionalSkills().size()); // Docker and AWS
    }

    @Test
    @DisplayName("Should correctly handle synonym variations (e.g., React.js -> react, SpringBoot -> spring boot)")
    void testSynonymMatching() {
        List<String> required = Arrays.asList("React.js", "SpringBoot", "REST APIs", "K8s");
        List<String> candidateSkills = Arrays.asList("React", "Spring Boot", "REST API", "Kubernetes");

        MatchResult result = matchingService.calculateMatch("job-3", "Dev", "cand-3", candidateSkills, required);

        assertEquals(100.0, result.getMatchPercentage());
        assertEquals(4, result.getMatchedCount());
        assertEquals(0, result.getMissingSkills().size());
    }

    @Test
    @DisplayName("Should return 0% Low Match when no required skills overlap")
    void testZeroMatch() {
        List<String> required = Arrays.asList("Rust", "Solidity", "Blockchain");
        List<String> candidateSkills = Arrays.asList("Python", "Flask", "Django");

        MatchResult result = matchingService.calculateMatch("job-4", "Blockchain Eng", "cand-4", candidateSkills, required);

        assertEquals(0.0, result.getMatchPercentage());
        assertEquals("Low Match", result.getTier());
        assertEquals(3, result.getMissingSkills().size());
    }

    @Test
    @DisplayName("Should return 100% baseline when job specifies no required skills")
    void testEmptyRequirements() {
        MatchResult result = matchingService.calculateMatch("job-5", "General", "cand-5",
                Arrays.asList("Java"), Collections.emptyList());

        assertEquals(100.0, result.getMatchPercentage());
        assertEquals("Strong Match", result.getTier());
    }
}

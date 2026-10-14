package com.skillmatch.service;

import com.skillmatch.model.MatchResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class SkillMatchingService {

    // Synonym normalization map
    private static final Map<String, String> SYNONYMS = new HashMap<>();

    static {
        SYNONYMS.put("react.js", "react");
        SYNONYMS.put("reactjs", "react");
        SYNONYMS.put("node.js", "node");
        SYNONYMS.put("nodejs", "node");
        SYNONYMS.put("springboot", "spring boot");
        SYNONYMS.put("spring-boot", "spring boot");
        SYNONYMS.put("mongodb", "mongo");
        SYNONYMS.put("mongo db", "mongo");
        SYNONYMS.put("postgres", "postgresql");
        SYNONYMS.put("postgres sql", "postgresql");
        SYNONYMS.put("vue.js", "vue");
        SYNONYMS.put("vuejs", "vue");
        SYNONYMS.put("angular.js", "angular");
        SYNONYMS.put("angularjs", "angular");
        SYNONYMS.put("restful apis", "rest api");
        SYNONYMS.put("restful api", "rest api");
        SYNONYMS.put("rest apis", "rest api");
        SYNONYMS.put("rest api", "rest api");
        SYNONYMS.put("rest", "rest api");
        SYNONYMS.put("cicd", "ci/cd");
        SYNONYMS.put("k8s", "kubernetes");
        SYNONYMS.put("javascript", "js");
        SYNONYMS.put("typescript", "ts");
        SYNONYMS.put("amazon web services", "aws");
        SYNONYMS.put("google cloud platform", "gcp");
        SYNONYMS.put("google cloud", "gcp");
    }

    public MatchResult calculateMatch(String jobId, String jobTitle, String candidateId, List<String> candidateSkills, List<String> requiredSkills) {
        if (candidateSkills == null) {
            candidateSkills = Collections.emptyList();
        }
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return new MatchResult(
                    jobId,
                    jobTitle,
                    candidateId,
                    100.0,
                    0,
                    0,
                    Collections.emptyList(),
                    Collections.emptyList(),
                    candidateSkills,
                    "Strong Match",
                    "No required skills specified for this role; 100% baseline match."
            );
        }

        // Build normalized set of candidate skills
        Set<String> normalizedCandidate = new HashSet<>();
        for (String skill : candidateSkills) {
            if (skill != null && !skill.trim().isEmpty()) {
                normalizedCandidate.add(normalize(skill));
            }
        }

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String req : requiredSkills) {
            if (req == null || req.trim().isEmpty()) continue;
            String normReq = normalize(req);
            if (normalizedCandidate.contains(normReq)) {
                matched.add(req.trim());
            } else {
                missing.add(req.trim());
            }
        }

        // Additional skills (candidate skills that weren't required)
        Set<String> normalizedRequired = new HashSet<>();
        for (String req : requiredSkills) {
            if (req != null && !req.trim().isEmpty()) {
                normalizedRequired.add(normalize(req));
            }
        }

        List<String> additional = new ArrayList<>();
        for (String cand : candidateSkills) {
            if (cand != null && !cand.trim().isEmpty() && !normalizedRequired.contains(normalize(cand))) {
                additional.add(cand.trim());
            }
        }

        int totalRequired = requiredSkills.size();
        int matchedCount = matched.size();
        double percentage = (double) matchedCount / (double) totalRequired * 100.0;
        double roundedPercentage = BigDecimal.valueOf(percentage).setScale(1, RoundingMode.HALF_UP).doubleValue();

        String tier;
        if (roundedPercentage >= 80.0) {
            tier = "Strong Match";
        } else if (roundedPercentage >= 50.0) {
            tier = "Moderate Match";
        } else {
            tier = "Low Match";
        }

        StringBuilder explanation = new StringBuilder();
        explanation.append("Candidate matches ").append(matchedCount)
                .append(" of ").append(totalRequired)
                .append(" required skills (").append(roundedPercentage).append("%). ");

        if (!matched.isEmpty()) {
            explanation.append("Matched: ").append(String.join(", ", matched)).append(". ");
        }
        if (!missing.isEmpty()) {
            explanation.append("Missing: ").append(String.join(", ", missing)).append(". ");
        }
        if (!additional.isEmpty()) {
            explanation.append("Bonus skills: ").append(String.join(", ", additional)).append(".");
        }

        return new MatchResult(
                jobId,
                jobTitle,
                candidateId,
                roundedPercentage,
                matchedCount,
                totalRequired,
                matched,
                missing,
                additional,
                tier,
                explanation.toString().trim()
        );
    }

    public String normalize(String skill) {
        if (skill == null) return "";
        String cleaned = skill.trim().toLowerCase();
        return SYNONYMS.getOrDefault(cleaned, cleaned);
    }
}

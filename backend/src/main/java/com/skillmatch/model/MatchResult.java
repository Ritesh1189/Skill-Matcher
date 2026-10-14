package com.skillmatch.model;

import java.util.ArrayList;
import java.util.List;

public class MatchResult {
    private String jobId;
    private String jobTitle;
    private String candidateId;
    private Double matchPercentage;
    private int matchedCount;
    private int totalRequiredCount;
    private List<String> matchedSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();
    private List<String> additionalSkills = new ArrayList<>();
    private String tier; // "Strong Match" (>= 80%), "Moderate Match" (50%-79%), "Low Match" (< 50%)
    private String explanation;

    public MatchResult() {
    }

    public MatchResult(String jobId, String jobTitle, String candidateId, Double matchPercentage, int matchedCount, int totalRequiredCount, List<String> matchedSkills, List<String> missingSkills, List<String> additionalSkills, String tier, String explanation) {
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.candidateId = candidateId;
        this.matchPercentage = matchPercentage;
        this.matchedCount = matchedCount;
        this.totalRequiredCount = totalRequiredCount;
        this.matchedSkills = matchedSkills != null ? matchedSkills : new ArrayList<>();
        this.missingSkills = missingSkills != null ? missingSkills : new ArrayList<>();
        this.additionalSkills = additionalSkills != null ? additionalSkills : new ArrayList<>();
        this.tier = tier;
        this.explanation = explanation;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(String candidateId) {
        this.candidateId = candidateId;
    }

    public Double getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(Double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public int getMatchedCount() {
        return matchedCount;
    }

    public void setMatchedCount(int matchedCount) {
        this.matchedCount = matchedCount;
    }

    public int getTotalRequiredCount() {
        return totalRequiredCount;
    }

    public void setTotalRequiredCount(int totalRequiredCount) {
        this.totalRequiredCount = totalRequiredCount;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills != null ? matchedSkills : new ArrayList<>();
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills != null ? missingSkills : new ArrayList<>();
    }

    public List<String> getAdditionalSkills() {
        return additionalSkills;
    }

    public void setAdditionalSkills(List<String> additionalSkills) {
        this.additionalSkills = additionalSkills != null ? additionalSkills : new ArrayList<>();
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}

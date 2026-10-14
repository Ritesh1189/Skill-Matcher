package com.skillmatch.dto;

import java.util.ArrayList;
import java.util.List;

public class MatchRequest {
    private String candidateId;
    private String jobId;
    private List<String> candidateSkills = new ArrayList<>();
    private List<String> requiredSkills = new ArrayList<>();

    public MatchRequest() {
    }

    public MatchRequest(List<String> candidateSkills, List<String> requiredSkills) {
        this.candidateSkills = candidateSkills;
        this.requiredSkills = requiredSkills;
    }

    public String getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(String candidateId) {
        this.candidateId = candidateId;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public List<String> getCandidateSkills() {
        return candidateSkills;
    }

    public void setCandidateSkills(List<String> candidateSkills) {
        this.candidateSkills = candidateSkills != null ? candidateSkills : new ArrayList<>();
    }

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills != null ? requiredSkills : new ArrayList<>();
    }
}

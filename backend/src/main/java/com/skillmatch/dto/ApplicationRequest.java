package com.skillmatch.dto;

import jakarta.validation.constraints.NotBlank;

public class ApplicationRequest {

    @NotBlank(message = "Job ID is required")
    private String jobId;

    @NotBlank(message = "Candidate ID is required")
    private String candidateId;

    private String coverNote;

    public ApplicationRequest() {
    }

    public ApplicationRequest(String jobId, String candidateId, String coverNote) {
        this.jobId = jobId;
        this.candidateId = candidateId;
        this.coverNote = coverNote;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(String candidateId) {
        this.candidateId = candidateId;
    }

    public String getCoverNote() {
        return coverNote;
    }

    public void setCoverNote(String coverNote) {
        this.coverNote = coverNote;
    }
}

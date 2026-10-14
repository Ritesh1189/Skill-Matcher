package com.skillmatch.repository;

import com.skillmatch.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByCandidateId(String candidateId);
    List<Application> findByJobId(String jobId);
    Optional<Application> findByJobIdAndCandidateId(String jobId, String candidateId);
    boolean existsByJobIdAndCandidateId(String jobId, String candidateId);
}

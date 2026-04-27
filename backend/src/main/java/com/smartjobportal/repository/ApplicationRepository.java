package com.smartjobportal.repository;

import com.smartjobportal.model.Application;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    List<Application> findByUserId(Long userId);

    List<Application> findByJobId(Long jobId);

    Optional<Application> findByUserIdAndJobId(Long userId, Long jobId);
}

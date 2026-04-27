package com.smartjobportal.repository;

import com.smartjobportal.model.Job;
import com.smartjobportal.model.User;
import com.smartjobportal.model.enums.JobStatus;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatus(JobStatus status);

    List<Job> findByStatusAndLocationContainingIgnoreCase(JobStatus status, String location);

    List<Job> findByStatusAndSalaryMinGreaterThanEqual(JobStatus status, BigDecimal salaryMin);

    List<Job> findByRecruiter(User recruiter);
}

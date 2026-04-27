package com.smartjobportal.repository;

import com.smartjobportal.model.JobSkill;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobSkillRepository extends JpaRepository<JobSkill, Long> {

    List<JobSkill> findByJobId(Long jobId);
}

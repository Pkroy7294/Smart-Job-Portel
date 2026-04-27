package com.smartjobportal.repository;

import com.smartjobportal.model.Resume;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Resume> findTopByUserIdOrderByCreatedAtDesc(Long userId);
}

package com.smartjobportal.repository;

import com.smartjobportal.model.UserSkill;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    List<UserSkill> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}

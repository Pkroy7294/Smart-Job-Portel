package com.smartjobportal.service;

import com.smartjobportal.dto.job.JobResponse;
import com.smartjobportal.model.Job;
import com.smartjobportal.repository.JobSkillRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class JobMatchingService {

    private final JobSkillRepository jobSkillRepository;

    public JobMatchingService(JobSkillRepository jobSkillRepository) {
        this.jobSkillRepository = jobSkillRepository;
    }

    public double calculateMatchPercentage(Set<String> userSkills, List<String> requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return 0.0;
        }

        long matched = requiredSkills.stream()
                .filter(skill -> userSkills.contains(skill.toLowerCase()))
                .count();
        return (matched * 100.0) / requiredSkills.size();
    }

    public List<JobResponse> rankJobs(List<Job> jobs, Set<String> userSkills) {
        Set<String> normalizedUserSkills = userSkills.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        return jobs.stream()
                .map(job -> {
                    List<String> skills = jobSkillRepository.findByJobId(job.getId()).stream()
                            .map(skill -> skill.getSkillName().toLowerCase())
                            .toList();
                    double match = calculateMatchPercentage(normalizedUserSkills, skills);
                    return new JobResponse(
                            job.getId(),
                            job.getTitle(),
                            job.getDescription(),
                            job.getCompanyName(),
                            job.getLocation(),
                            job.getEmploymentType(),
                            job.getSalaryMin(),
                            job.getSalaryMax(),
                            job.getStatus(),
                            job.getRecruiter().getFullName(),
                            skills,
                            match);
                })
                .sorted(Comparator.comparing(JobResponse::matchPercentage).reversed())
                .toList();
    }
}

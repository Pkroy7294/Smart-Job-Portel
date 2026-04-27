package com.smartjobportal.service;

import com.smartjobportal.dto.job.JobCreateRequest;
import com.smartjobportal.dto.job.JobResponse;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.model.Job;
import com.smartjobportal.model.JobSkill;
import com.smartjobportal.model.User;
import com.smartjobportal.model.enums.JobStatus;
import com.smartjobportal.model.enums.Role;
import com.smartjobportal.repository.JobRepository;
import com.smartjobportal.repository.JobSkillRepository;
import com.smartjobportal.repository.UserSkillRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobSkillRepository jobSkillRepository;
    private final CurrentUserService currentUserService;
    private final UserSkillRepository userSkillRepository;
    private final JobMatchingService jobMatchingService;

    public JobService(
            JobRepository jobRepository,
            JobSkillRepository jobSkillRepository,
            CurrentUserService currentUserService,
            UserSkillRepository userSkillRepository,
            JobMatchingService jobMatchingService) {
        this.jobRepository = jobRepository;
        this.jobSkillRepository = jobSkillRepository;
        this.currentUserService = currentUserService;
        this.userSkillRepository = userSkillRepository;
        this.jobMatchingService = jobMatchingService;
    }

    @Transactional
    public JobResponse createJob(JobCreateRequest request) {
        User recruiter = currentUserService.getCurrentUser();
        if (recruiter.getRole() != Role.RECRUITER && recruiter.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Only recruiters and admins can post jobs.");
        }

        Job job = new Job();
        job.setRecruiter(recruiter);
        job.setTitle(request.title());
        job.setDescription(request.description());
        job.setCompanyName(request.companyName());
        job.setLocation(request.location());
        job.setEmploymentType(request.employmentType());
        job.setSalaryMin(request.salaryMin());
        job.setSalaryMax(request.salaryMax());
        job.setStatus(request.status());

        Job savedJob = jobRepository.save(job);
        List<String> normalizedSkills = request.skills().stream()
                .map(String::trim)
                .map(String::toLowerCase)
                .distinct()
                .toList();

        normalizedSkills.forEach(skillName -> {
            JobSkill skill = new JobSkill();
            skill.setJob(savedJob);
            skill.setSkillName(skillName);
            jobSkillRepository.save(skill);
        });

        return toResponse(savedJob, normalizedSkills, null);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> listJobs(String location, BigDecimal salaryMin) {
        List<Job> jobs;
        if (location != null && !location.isBlank()) {
            jobs = jobRepository.findByStatusAndLocationContainingIgnoreCase(JobStatus.OPEN, location);
        } else if (salaryMin != null) {
            jobs = jobRepository.findByStatusAndSalaryMinGreaterThanEqual(JobStatus.OPEN, salaryMin);
        } else {
            jobs = jobRepository.findByStatus(JobStatus.OPEN);
        }

        return jobs.stream()
                .map(job -> toResponse(job, getJobSkills(job.getId()), null))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getRecommendedJobsForCurrentUser() {
        User user = currentUserService.getCurrentUser();
        Set<String> userSkills = userSkillRepository.findByUserId(user.getId()).stream()
                .map(skill -> skill.getSkillName().toLowerCase())
                .collect(Collectors.toSet());
        List<Job> openJobs = jobRepository.findByStatus(JobStatus.OPEN);
        return jobMatchingService.rankJobs(openJobs, userSkills);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getMyJobs() {
        User recruiter = currentUserService.getCurrentUser();
        return jobRepository.findByRecruiter(recruiter).stream()
                .map(job -> toResponse(job, getJobSkills(job.getId()), null))
                .toList();
    }

    @Transactional(readOnly = true)
    public JobResponse getJobResponse(Long jobId) {
        Job job = findById(jobId);
        return toResponse(job, getJobSkills(jobId), null);
    }

    @Transactional(readOnly = true)
    public Job findById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
    }

    public List<String> getJobSkills(Long jobId) {
        return jobSkillRepository.findByJobId(jobId).stream()
                .map(JobSkill::getSkillName)
                .toList();
    }

    private JobResponse toResponse(Job job, List<String> skills, Double matchPercentage) {
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
                matchPercentage);
    }
}

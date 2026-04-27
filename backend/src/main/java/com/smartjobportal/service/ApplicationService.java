package com.smartjobportal.service;

import com.smartjobportal.dto.application.ApplicationRequest;
import com.smartjobportal.dto.application.ApplicationResponse;
import com.smartjobportal.exception.BusinessException;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.model.Application;
import com.smartjobportal.model.Job;
import com.smartjobportal.model.Resume;
import com.smartjobportal.model.User;
import com.smartjobportal.model.enums.ApplicationStatus;
import com.smartjobportal.repository.ApplicationRepository;
import com.smartjobportal.repository.ResumeRepository;
import com.smartjobportal.repository.UserSkillRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ResumeRepository resumeRepository;
    private final UserSkillRepository userSkillRepository;
    private final CurrentUserService currentUserService;
    private final JobService jobService;
    private final JobMatchingService jobMatchingService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            ResumeRepository resumeRepository,
            UserSkillRepository userSkillRepository,
            CurrentUserService currentUserService,
            JobService jobService,
            JobMatchingService jobMatchingService) {
        this.applicationRepository = applicationRepository;
        this.resumeRepository = resumeRepository;
        this.userSkillRepository = userSkillRepository;
        this.currentUserService = currentUserService;
        this.jobService = jobService;
        this.jobMatchingService = jobMatchingService;
    }

    @Transactional
    public ApplicationResponse apply(ApplicationRequest request) {
        User user = currentUserService.getCurrentUser();
        Job job = jobService.findById(request.jobId());

        if (applicationRepository.existsByUserIdAndJobId(user.getId(), job.getId())) {
            throw new BusinessException("You have already applied for this job.");
        }

        Resume resume = null;
        if (request.resumeId() != null) {
            resume = resumeRepository.findById(request.resumeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + request.resumeId()));
        }

        Set<String> userSkills = userSkillRepository.findByUserId(user.getId()).stream()
                .map(skill -> skill.getSkillName().toLowerCase())
                .collect(Collectors.toSet());
        List<String> jobSkills = jobService.getJobSkills(job.getId()).stream()
                .map(String::toLowerCase)
                .toList();

        BigDecimal matchScore = BigDecimal.valueOf(jobMatchingService.calculateMatchPercentage(userSkills, jobSkills))
                .setScale(2, RoundingMode.HALF_UP);

        Application application = new Application();
        application.setUser(user);
        application.setJob(job);
        application.setResume(resume);
        application.setCoverLetter(request.coverLetter());
        application.setStatus(ApplicationStatus.APPLIED);
        application.setMatchScore(matchScore);

        Application savedApplication = applicationRepository.save(application);
        return toResponse(savedApplication);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications() {
        User user = currentUserService.getCurrentUser();
        return applicationRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicantsForJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::toResponse)
                .toList();
    }

    private ApplicationResponse toResponse(Application application) {
        return new ApplicationResponse(
                application.getId(),
                application.getJob().getId(),
                application.getJob().getTitle(),
                application.getUser().getId(),
                application.getUser().getFullName(),
                application.getStatus(),
                application.getMatchScore());
    }
}

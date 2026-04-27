package com.smartjobportal.service;

import com.smartjobportal.config.ResumeProperties;
import com.smartjobportal.dto.resume.ResumeAnalysisResponse;
import com.smartjobportal.exception.BusinessException;
import com.smartjobportal.model.Resume;
import com.smartjobportal.model.User;
import com.smartjobportal.model.UserSkill;
import com.smartjobportal.model.enums.JobStatus;
import com.smartjobportal.model.enums.ResumeUploadStatus;
import com.smartjobportal.repository.JobRepository;
import com.smartjobportal.repository.ResumeRepository;
import com.smartjobportal.repository.UserSkillRepository;
import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserSkillRepository userSkillRepository;
    private final CurrentUserService currentUserService;
    private final SkillExtractionService skillExtractionService;
    private final JobRepository jobRepository;
    private final Tika tika;
    private final ResumeProperties resumeProperties;

    public ResumeService(
            ResumeRepository resumeRepository,
            UserSkillRepository userSkillRepository,
            CurrentUserService currentUserService,
            SkillExtractionService skillExtractionService,
            JobRepository jobRepository,
            Tika tika,
            ResumeProperties resumeProperties) {
        this.resumeRepository = resumeRepository;
        this.userSkillRepository = userSkillRepository;
        this.currentUserService = currentUserService;
        this.skillExtractionService = skillExtractionService;
        this.jobRepository = jobRepository;
        this.tika = tika;
        this.resumeProperties = resumeProperties;
    }

    @Transactional
    public ResumeAnalysisResponse uploadResume(MultipartFile file) {
        validateFile(file);

        User user = currentUserService.getCurrentUser();
        Resume resume = new Resume();
        resume.setUser(user);
        resume.setFileName(file.getOriginalFilename());
        resume.setContentType(file.getContentType() == null ? "application/octet-stream" : file.getContentType());
        resume.setUploadStatus(ResumeUploadStatus.UPLOADED);

        Resume savedResume = resumeRepository.save(resume);

        try {
            String extractedText = tika.parseToString(file.getInputStream());
            Set<String> skills = skillExtractionService.extractSkills(extractedText);

            savedResume.setExtractedText(extractedText);
            savedResume.setUploadStatus(ResumeUploadStatus.ANALYZED);
            resumeRepository.save(savedResume);

            syncUserSkills(user, skills);

            List<String> recommendedJobs = jobRepository.findByStatus(JobStatus.OPEN).stream()
                    .filter(job -> !job.getDescription().isBlank())
                    .filter(job -> skills.stream().anyMatch(skill ->
                            job.getDescription().toLowerCase(Locale.ROOT).contains(skill.toLowerCase(Locale.ROOT))))
                    .map(job -> job.getTitle())
                    .distinct()
                    .limit(5)
                    .toList();

            return new ResumeAnalysisResponse(savedResume.getId(), savedResume.getFileName(), List.copyOf(skills), recommendedJobs);
        } catch (IOException | TikaException ex) {
            savedResume.setUploadStatus(ResumeUploadStatus.FAILED);
            resumeRepository.save(savedResume);
            throw new BusinessException("Failed to analyze resume.");
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Resume file is required.");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.contains(".")) {
            throw new BusinessException("Invalid resume file name.");
        }

        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
        if (!resumeProperties.getAllowedExtensions().contains(extension)) {
            throw new BusinessException("Only PDF, DOC, and DOCX resumes are allowed.");
        }
    }

    private void syncUserSkills(User user, Set<String> extractedSkills) {
        userSkillRepository.deleteByUserId(user.getId());
        extractedSkills.forEach(skillName -> {
            UserSkill skill = new UserSkill();
            skill.setUser(user);
            skill.setSkillName(skillName.toLowerCase(Locale.ROOT));
            userSkillRepository.save(skill);
        });
    }
}

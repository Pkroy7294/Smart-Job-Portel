package com.smartjobportal.service;

import com.smartjobportal.config.ResumeProperties;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class SkillExtractionService {

    private final ResumeProperties resumeProperties;

    public SkillExtractionService(ResumeProperties resumeProperties) {
        this.resumeProperties = resumeProperties;
    }

    public Set<String> extractSkills(String text) {
        String normalizedText = text == null ? "" : text.toLowerCase(Locale.ROOT);
        Set<String> skills = new LinkedHashSet<>();
        for (String keyword : resumeProperties.getSkillKeywords()) {
            if (normalizedText.contains(keyword.toLowerCase(Locale.ROOT))) {
                skills.add(keyword);
            }
        }
        return skills;
    }
}

package com.smartjobportal.config;

import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.resume")
public class ResumeProperties {

    private List<String> allowedExtensions = new ArrayList<>();
    private List<String> skillKeywords = new ArrayList<>();

    public List<String> getAllowedExtensions() {
        return allowedExtensions;
    }

    public void setAllowedExtensions(List<String> allowedExtensions) {
        this.allowedExtensions = allowedExtensions;
    }

    public List<String> getSkillKeywords() {
        return skillKeywords;
    }

    public void setSkillKeywords(List<String> skillKeywords) {
        this.skillKeywords = skillKeywords;
    }
}

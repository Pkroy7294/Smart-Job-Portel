package com.smartjobportal.dto.resume;

import java.util.List;

public record ResumeAnalysisResponse(
        Long resumeId,
        String fileName,
        List<String> extractedSkills,
        List<String> recommendedJobTitles
) {
}

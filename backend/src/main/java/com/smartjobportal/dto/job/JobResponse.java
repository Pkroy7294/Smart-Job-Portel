package com.smartjobportal.dto.job;

import com.smartjobportal.model.enums.JobStatus;
import java.math.BigDecimal;
import java.util.List;

public record JobResponse(
        Long id,
        String title,
        String description,
        String companyName,
        String location,
        String employmentType,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        JobStatus status,
        String recruiterName,
        List<String> skills,
        Double matchPercentage
) {
}

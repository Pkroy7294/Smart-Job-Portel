package com.smartjobportal.dto.application;

import com.smartjobportal.model.enums.ApplicationStatus;
import java.math.BigDecimal;

public record ApplicationResponse(
        Long id,
        Long jobId,
        String jobTitle,
        Long applicantId,
        String applicantName,
        ApplicationStatus status,
        BigDecimal matchScore
) {
}

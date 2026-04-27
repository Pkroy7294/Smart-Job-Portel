package com.smartjobportal.dto.application;

import jakarta.validation.constraints.NotNull;

public record ApplicationRequest(
        @NotNull Long jobId,
        Long resumeId,
        String coverLetter
) {
}

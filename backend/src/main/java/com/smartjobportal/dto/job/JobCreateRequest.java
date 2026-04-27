package com.smartjobportal.dto.job;

import com.smartjobportal.model.enums.JobStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record JobCreateRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String companyName,
        @NotBlank String location,
        @NotBlank String employmentType,
        @DecimalMin("0.0") BigDecimal salaryMin,
        @DecimalMin("0.0") BigDecimal salaryMax,
        @NotNull JobStatus status,
        @NotEmpty List<String> skills
) {
}

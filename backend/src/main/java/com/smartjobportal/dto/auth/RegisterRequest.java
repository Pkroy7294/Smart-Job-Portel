package com.smartjobportal.dto.auth;

import com.smartjobportal.model.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 120) String fullName,
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6, max = 100) String password,
        @NotNull Role role,
        String location,
        String profileSummary,
        Integer yearsOfExperience
) {
}

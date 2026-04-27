package com.smartjobportal.dto.auth;

import com.smartjobportal.model.enums.Role;

public record AuthResponse(
        String token,
        Long userId,
        String fullName,
        String email,
        Role role
) {
}

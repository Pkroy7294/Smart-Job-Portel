package com.smartjobportal.service;

import com.smartjobportal.dto.auth.AuthRequest;
import com.smartjobportal.dto.auth.AuthResponse;
import com.smartjobportal.dto.auth.RegisterRequest;
import com.smartjobportal.exception.BusinessException;
import com.smartjobportal.model.User;
import com.smartjobportal.repository.UserRepository;
import com.smartjobportal.security.CustomUserDetails;
import com.smartjobportal.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email is already registered.");
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setLocation(request.location());
        user.setProfileSummary(request.profileSummary());
        user.setYearsOfExperience(request.yearsOfExperience());

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(new CustomUserDetails(savedUser));
        return new AuthResponse(token, savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("User not found."));

        String token = jwtService.generateToken(new CustomUserDetails(user));
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}

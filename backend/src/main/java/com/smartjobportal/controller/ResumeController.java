package com.smartjobportal.controller;

import com.smartjobportal.dto.resume.ResumeAnalysisResponse;
import com.smartjobportal.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ResumeAnalysisResponse> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(resumeService.uploadResume(file));
    }
}

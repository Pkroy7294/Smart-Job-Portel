package com.smartjobportal.controller;

import com.smartjobportal.dto.job.JobCreateRequest;
import com.smartjobportal.dto.job.JobResponse;
import com.smartjobportal.service.JobService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(request));
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> listJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal salaryMin) {
        return ResponseEntity.ok(jobService.listJobs(location, salaryMin));
    }

    @GetMapping("/recommended")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<JobResponse>> recommendedJobs() {
        return ResponseEntity.ok(jobService.getRecommendedJobsForCurrentUser());
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
    public ResponseEntity<List<JobResponse>> myJobs() {
        return ResponseEntity.ok(jobService.getMyJobs());
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getJobResponse(jobId));
    }
}

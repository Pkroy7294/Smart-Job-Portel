CREATE DATABASE IF NOT EXISTS smart_job_portal;
USE smart_job_portal;

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role VARCHAR(20) NOT NULL,
    profile_summary TEXT NULL,
    location VARCHAR(120) NULL,
    years_of_experience INT NULL,
    CONSTRAINT uk_users_email UNIQUE (email),
    INDEX idx_users_role (role),
    INDEX idx_users_location (location)
);

CREATE TABLE jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    recruiter_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    location VARCHAR(120) NOT NULL,
    employment_type VARCHAR(40) NOT NULL,
    salary_min DECIMAL(12, 2) NULL,
    salary_max DECIMAL(12, 2) NULL,
    status VARCHAR(20) NOT NULL,
    INDEX idx_jobs_recruiter (recruiter_id),
    INDEX idx_jobs_location (location),
    INDEX idx_jobs_status (status),
    INDEX idx_jobs_salary_min (salary_min),
    CONSTRAINT fk_jobs_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id)
);

CREATE TABLE resumes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    extracted_text LONGTEXT NULL,
    upload_status VARCHAR(30) NOT NULL,
    INDEX idx_resumes_user (user_id),
    CONSTRAINT fk_resumes_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    resume_id BIGINT NULL,
    cover_letter TEXT NULL,
    status VARCHAR(30) NOT NULL,
    match_score DECIMAL(5, 2) NULL,
    INDEX idx_applications_user (user_id),
    INDEX idx_applications_job (job_id),
    INDEX idx_applications_status (status),
    CONSTRAINT uk_application_user_job UNIQUE (user_id, job_id),
    CONSTRAINT fk_applications_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id),
    CONSTRAINT fk_applications_resume FOREIGN KEY (resume_id) REFERENCES resumes(id)
);

CREATE TABLE user_skills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    INDEX idx_user_skills_user (user_id),
    INDEX idx_user_skills_skill (skill_name),
    CONSTRAINT uk_user_skill UNIQUE (user_id, skill_name),
    CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE job_skills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    job_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    INDEX idx_job_skills_job (job_id),
    INDEX idx_job_skills_skill (skill_name),
    CONSTRAINT uk_job_skill UNIQUE (job_id, skill_name),
    CONSTRAINT fk_job_skills_job FOREIGN KEY (job_id) REFERENCES jobs(id)
);

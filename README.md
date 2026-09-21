# 🛡️ AuditFlow — Enterprise AI Workflow Versioning & Audit Platform

![Java 21](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-green.svg)
![React 19](https://img.shields.io/badge/React-19.0.0-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg)
![Docker](https://img.shields.io/badge/Docker-Supported-2496ED.svg)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)
![Tests](https://img.shields.io/badge/Tests-14%2F14%20Passed-success.svg)

**AuditFlow** is an enterprise-grade platform for versioning, auditing, and validating AI agent workflows. It provides immutable version control for LLM prompts and completions, automated 4-layer security validation gates, semantic diffing between workflow editions, Role-Based Access Control (RBAC), and automated AWS S3 export backup capabilities.

---

## 🌟 Key Features

### 📚 1. Immutable Workflow Versioning
- **Chapters**: Individual execution steps tagged with actor, prompt, model (`gpt-4o`, `claude-3.5-sonnet`), temperature, seed, and SHA-256 validation status.
- **Books**: Version-controlled sequences of chapters representing full AI agent execution pipelines.
- **Editions**: Linear parent-child versioning (`v1` → `v2`) ensuring complete historical auditability.
- **Feature Shelves**: Logical categorization of workflows by feature (e.g. `finance`, `support`, `security`).

### 🔍 2. Visual Semantic Diff Engine
- Compare prompt and completion changes side-by-side between any two workflow editions (`Book v1` vs `Book v2`).
- Identifies **Kept**, **Added**, and **Removed** execution steps with color-coded diff syntax highlighting.

### 🛡️ 3. 4-Layer Validation Gate Harness
- **Layer 1 (Schema & Format)**: Validates JSON output structure and required keyword presence.
- **Layer 2 (ReDoS Regex)**: Evaluates regex compliance with ReDoS attack protection.
- **Layer 3 (PII Privacy)**: Scans input prompts and completions for exposed sensitive PII data.
- **Layer 4 (Security Scanner)**: Detects prompt injection patterns (`bypass`, `ignore instructions`, system prompt leak attempts).

### 🔐 4. Stateless JWT Authentication & 4-Tier RBAC
- Stateless HMAC-SHA256 JWT authorization with 24-hour token expiration.
- Interactive authentication modal with **Sign In**, **Sign Up**, and **One-Click Demo Account Switching**:
  - 🔴 **ADMIN**: Full system control, user management, API key revocation, and system backups.
  - 🟣 **DEVELOPER**: Chapter creation, workflow assembly, and validation testing.
  - 🟢 **AUDITOR**: Compliance inspection, semantic diff viewing, and audit logs.
  - ⚪ **VIEWER**: Read-only observation across feature shelves.

### ☁️ 5. Cloud Backups & AWS S3 Sync
- Online point-in-time database snapshot packaging.
- On-demand and scheduled export metadata syncing to AWS S3 buckets (`s3://auditflow-exports-prod/backups/`).

---

## 🏗️ Architecture & Technology Stack

```text
               ┌─────────────────────────────────────────┐
               │    React 19 + TypeScript + Tailwind v4   │
               │            AuditFlow Dashboard          │
               └────────────────────┬────────────────────┘
                                    │ HTTP / REST API
                                    ▼
               ┌─────────────────────────────────────────┐
               │       Spring Boot 3.4.3 (Java 21)       │
               │   Spring Security + JJWT Auth Filter    │
               └────────┬───────────────────────┬────────┘
                        │                       │
                        ▼                       ▼
               ┌─────────────────┐     ┌─────────────────┐
               │ PostgreSQL / H2 │     │   Redis 7.0     │
               │  Relational DB  │     │ Cache & Sessions│
               └─────────────────┘     └─────────────────┘
```

| Component | Technology |
|---|---|
| **Backend** | Java 21, Spring Boot 3.4.3, Spring Security 6, JJWT 0.12.6, PostgreSQL, Redis, Lombok |
| **Frontend** | React 19, TypeScript 5.7, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React |
| **Testing** | JUnit 5, Mockito, Spring Security Test (**14/14 automated tests passed**) |
| **Containerization** | Docker, Multi-Stage Dockerfile, Docker Compose, Nginx |

---

## ⚡ Quick Start

### Option A: Launch with Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/ATHARVA262005/AuditFlow.git
   cd AuditFlow
   ```

2. Spin up the full production stack (Backend + Frontend + Postgres + Redis):
   ```bash
   docker-compose up --build
   ```

3. Access the dashboard:
   - **Frontend UI**: [http://localhost:80](http://localhost:80)
   - **Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)

---

### Option B: Local Development Setup

#### 1. Backend (Java 21 + Spring Boot)
```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`.

#### 2. Frontend (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🔑 Pre-Seeded Demo Credentials

You can test real-time Role-Based Access Control using the built-in preset accounts:

| Role | Username | Password | Email | Permissions |
|---|---|---|---|---|
| **ADMIN** | `admin` | `admin123` | `admin@auditflow.io` | Full Access, RBAC & Key Management |
| **DEVELOPER** | `developer` | `dev123` | `developer@auditflow.io` | API Key Generation, Validation Testing |
| **AUDITOR** | `auditor` | `audit123` | `auditor@auditflow.io` | Diff Viewing & System Audit Logs |
| **VIEWER** | `viewer` | `viewer123` | `viewer@auditflow.io` | Read-only observation |

---

## 🧪 Automated Testing

Run the full backend unit test suite:

```bash
cd backend
mvn test
```

### Test Results
```text
[INFO]  T E S T S
[INFO] Running com.auditflow.service.AuthServiceTest — 4 tests passed
[INFO] Running com.auditflow.service.BookServiceTest — 2 tests passed
[INFO] Running com.auditflow.service.ChapterServiceTest — 2 tests passed
[INFO] Running com.auditflow.service.DiffServiceTest — 1 test passed
[INFO] Running com.auditflow.service.SystemExportServiceTest — 2 tests passed
[INFO] Running com.auditflow.validation.ValidationEngineTest — 3 tests passed
[INFO] Results: Tests run: 14, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 📖 API Endpoint Reference

| Method | Endpoint | Description | Access Level |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate user & issue signed JWT | Public |
| `GET` | `/api/v1/chapters` | List all chapters | Authenticated |
| `POST` | `/api/v1/chapters` | Log new chapter step | DEVELOPER / ADMIN |
| `GET` | `/api/v1/books` | List workflow books | Authenticated |
| `POST` | `/api/v1/books` | Create new workflow edition | DEVELOPER / ADMIN |
| `GET` | `/api/v1/diff/books` | Calculate semantic diff between books | AUDITOR / ADMIN |
| `POST` | `/api/v1/validation/test` | Test prompt/completion on 4-layer engine | DEVELOPER / ADMIN |
| `POST` | `/api/v1/system/s3-sync` | Export database telemetry & sync to AWS S3 | ADMIN |

---

## 🚀 AWS EC2 & S3 Deployment

See the complete deployment guide in [aws-deployment.md](aws-deployment.md) for deploying AuditFlow to AWS EC2 with automatic export backups to S3.

---

## 📄 License & Proprietary Rights

Copyright © 2026 AuditFlow. All Rights Reserved.

This software and associated documentation files are proprietary and confidential. Unauthorized copying, distribution, modification, or transfer of this software, via any medium, is strictly prohibited.

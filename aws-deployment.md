# AuditFlow AWS EC2 & S3 Production Deployment Guide

This guide details deploying **AuditFlow** (Java 21, Spring Boot, PostgreSQL, Redis, React 19, Nginx) to AWS EC2 with automatic export backups to AWS S3.

---

## 1. Prerequisites & AWS Resource Setup

1. **AWS S3 Bucket Creation**:
   ```bash
   aws s3api create-bucket --bucket auditflow-exports-prod --region us-east-1
   ```
2. **AWS EC2 Instance**:
   - Instance type: `t3.medium` (2 vCPU, 4 GiB RAM)
   - OS: Ubuntu Server 24.04 LTS
   - Security Group Inbound Rules:
     - Port 22 (SSH)
     - Port 80 (HTTP)
     - Port 443 (HTTPS)
     - Port 8080 (Backend API access, optional)

---

## 2. Server Environment Configuration

SSH into your EC2 instance and install Docker & Docker Compose:

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2 git
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
```

---

## 3. Clone Repository & Launch Stack

```bash
git clone https://github.com/your-org/auditflow.git
cd auditflow

# Launch production multi-container setup
docker compose up -d --build
```

---

## 4. Verification & Health Monitoring

Check container liveness:

```bash
docker compose ps
docker compose logs -f backend
```

Verify endpoints:
- Frontend Dashboard: `http://<EC2-PUBLIC-IP>/`
- API Health Check: `http://<EC2-PUBLIC-IP>/api/v1/audit-logs/stats`

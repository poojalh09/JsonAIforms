# AI Integrated Forms 🚀

## Overview
AI Integrated Forms is a Next.js web application that allows users to generate, view, and manage dynamic forms with AI-powered capabilities.

## 🌟 Features
- Dynamic form generation
- AI-assisted form creation
- Form preview and management
- Serverless deployment
- Scalable architecture

## 🛠 Tech Stack
- **Frontend**: Next.js 13
- **Backend**: Node.js
- **Deployment**: AWS ECS, GitHub Actions
- **Containerization**: Docker
- **Infrastructure**: CloudFormation

## 📦 Prerequisites
- Node.js 18.x
- npm 9.x
- AWS Account
- GitHub Account
- Docker

## 🚀 Local Development

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-integrated-forms.git

# Navigate to project directory
cd ai-integrated-forms

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🌐 Deployment Architecture

### Infrastructure Components
1. **Amazon ECS (Elastic Container Service)**
   - Hosts containerized Next.js application
   - Provides scalability and high availability

2. **Amazon ECR (Elastic Container Registry)**
   - Stores Docker images
   - Manages container versioning

3. **GitHub Actions**
   - Continuous Integration/Continuous Deployment (CI/CD)
   - Automates build, test, and deployment processes

### Deployment Workflow
1. Code pushed to `main` branch
2. GitHub Actions triggers workflow
3. Application is:
   - Tested
   - Built
   - Containerized
   - Pushed to ECR
   - Deployed to ECS

## 🔧 AWS Setup Guide

### 1. Create ECR Repository
```bash
aws ecr create-repository \
    --repository-name ai-integrated-forms \
    --region us-east-2
```

### 2. Create ECS Cluster
```bash
aws ecs create-cluster \
    --cluster-name ai-forms-cluster \
    --region us-east-2
```

### 3. IAM Roles and Permissions
- Create `github-actions-ecs-deploy` IAM role
- Attach policies:
  - `AmazonECS_FullAccess`
  - `AmazonEC2ContainerRegistryFullAccess`

## 🔐 GitHub Secrets Configuration
Configure the following secrets in GitHub repository:
- `AWS_ACCOUNT_ID`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SLACK_WEBHOOK` (optional)

## 📋 CloudFormation Deployment
```bash
aws cloudformation create-stack \
    --stack-name ai-integrated-forms \
    --template-body file://aws-cloudformation-template.yml \
    --capabilities CAPABILITY_IAM
```

## 🐳 Docker Build
```bash
# Build Docker image
docker build -t ai-integrated-forms .

# Run locally
docker run -p 3000:3000 ai-integrated-forms
```

## 🧪 Testing
```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run test:e2e
```

## 🔍 Monitoring
- CloudWatch Logs
- ECS Service Metrics
- GitHub Actions Workflow Logs

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

<!-- ## 📄 License
MIT License -->

## 🚨 Troubleshooting
- Check GitHub Actions logs
- Verify AWS credentials
- Ensure Docker is running
- Validate CloudFormation stack events

<!-- ## 📞 Support
For issues, please open a GitHub issue or contact support@aiintegratedforms.com -->

---
<!-- 
**Happy Deploying! 🎉** -->

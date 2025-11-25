# GitHub Actions CI/CD

This module sets up complete GitHub Actions workflows for continuous integration and continuous deployment (CI/CD), including automated testing, infrastructure setup, and deployment.

## What This Does

This VCS module creates:
- GitHub Actions workflows for automated deployment
- Infrastructure setup automation (Terraform)
- Build and test automation
- Multi-environment deployment (dev, staging, production)
- Automated Docker image building and pushing
- Database migration automation
- SSL certificate management workflows

---

## Prerequisites

Before configuring this module, you need:
1. A GitHub account (sign up at https://github.com)
2. An existing GitHub organization or use your personal account
3. Permissions to create repositories in the organization/account

---

## Configuration Fields

### GitHub Organization/User `githubOrg`
**What it is**: The GitHub organization name or your personal username where the repository will be created.

**Options**: This field is populated automatically from your connected GitHub account. Genesis fetches your accessible organizations and your username.

**Format**:
- Organization: `my-company` (organization name)
- Personal: `johndoe` (your GitHub username)

**How to find it manually**:
1. Log into GitHub (https://github.com)
2. Click your profile picture in top-right
3. For organizations: Click "Your organizations" to see list
4. Your username is displayed at the top of the dropdown

**Examples**:
- Organization: `acme-corp`
- Personal account: `john-smith`

**When to use Organization vs Personal**:

**Organization** (recommended for teams):
- Multiple team members need access
- Want to separate personal and work projects
- Need team permissions and access control
- Professional/company projects

**Personal Account**:
- Solo projects
- Personal side projects
- Learning and experimentation
- Don't need team collaboration

**How to create a GitHub Organization** (if needed):
1. Click your profile picture → "Your organizations"
2. Click "New organization"
3. Choose "Create a free organization"
4. Enter organization name (e.g., `my-startup`)
5. Add your email → "Next"
6. Skip team member invites for now → "Complete setup"

---

### GitHub Repository Name `githubRepo`
**What it is**: The name of the GitHub repository that will be created for your project.

**Default**: Genesis automatically uses your project name as the repository name.

**Format**: 
- Lowercase letters, numbers, hyphens, and underscores only
- Must start with a letter or number
- No spaces

**Good Examples**:
- `my-app`
- `customer-portal`
- `inventory-system`
- `project_alpha`

**Bad Examples**:
- `My App` (has space)
- `-myapp` (starts with hyphen)
- `my.app` (has period)

**Best Practices**:
- Keep it short and descriptive
- Use hyphens for readability (e.g., `my-app` not `myapp`)
- Match your project name for consistency
- Avoid generic names like `app` or `project`

**Note**: Genesis will automatically create this repository for you with the initial code commit.

---

## What Gets Created

When you use this module, GitHub Actions workflows are created for:

### Infrastructure Setup:
- **Terraform Apply** - Creates AWS infrastructure (VPC, EC2, RDS, etc.)
- **Terraform Plan** - Shows what will change before applying
- **Infrastructure Teardown** - Safely destroys resources when needed

### SSL Certificate Management:
- **Client SSL** - Sets up SSL certificates for frontend (CloudFront/CloudFlare)
- **Server SSL** - Sets up SSL certificates for backend (Load Balancer)
- **Certificate Renewal** - Automatically renews certificates before expiry

### Build & Deploy:
- **Backend Deploy** - Builds and deploys backend to EC2 instances
- **Frontend Deploy** - Builds and deploys frontend to S3/CloudFront
- **Database Migrations** - Runs database schema migrations

### Testing:
- **Run Tests** - Executes unit and integration tests
- **Lint Code** - Checks code quality and style

### Workflow Triggers:
- **Push to main** - Deploys to production environment
- **Push to staging** - Deploys to staging environment  
- **Pull request** - Runs tests and validation
- **Manual trigger** - Deploy on demand via GitHub UI

---

## GitHub Secrets Configuration

Genesis automatically configures GitHub repository secrets for secure credential storage:

### AWS Credentials (if using AWS provider):
- `AWS_ACCOUNT_ID` - Your AWS account ID
- `AWS_ADMIN_ID` - AWS access key ID
- `AWS_ADMIN_SECRET` - AWS secret access key

### Domain/DNS Secrets (if using DNS):
- `CLOUDFLARE_API_TOKEN` - For Cloudflare DNS
- `ROUTE53_HOSTED_ZONE_ID` - For AWS Route53

### Database Credentials:
- `DATABASE_URL` - Production database connection string
- `DATABASE_USERNAME` - Database user
- `DATABASE_PASSWORD` - Database password

**How Genesis handles secrets**:
1. You provide sensitive values during project generation
2. Genesis automatically creates GitHub secrets via GitHub API
3. Workflows reference secrets as `${{ secrets.AWS_ADMIN_ID }}`
4. Secrets are never exposed in logs or code

---

## Viewing Workflows

After your repository is created:

1. **Go to your repository** on GitHub
2. **Click "Actions" tab** at the top
3. **See all workflows** in the left sidebar
4. **Click a workflow** to see its runs and status
5. **Manually trigger** workflows using "Run workflow" button

**Workflow file locations**:
All workflow YAML files are in `.github/workflows/` directory in your repository.

---

## Common Issues

### "Workflow Failed" - Permission Denied
**Problem**: GitHub Actions doesn't have permission to access secrets or resources.

**Solutions**:
- Go to Settings → Actions → General
- Ensure "Read and write permissions" is enabled
- Check secrets are configured: Settings → Secrets and variables → Actions
- Verify AWS credentials are correct and active

### "AWS Access Denied"
**Problem**: AWS IAM user lacks required permissions.

**Solutions**:
- Verify IAM user has `AdministratorAccess` policy (or specific policies needed)
- Check access key is active in AWS IAM console
- Ensure correct AWS region is configured
- Try creating a new access key

### "Repository Not Found"
**Problem**: Repository wasn't created or permissions issue.

**Solutions**:
- Check if repository exists in your organization/account
- Verify you have admin access to the organization
- Genesis may need "repo" and "admin:org" OAuth scopes
- Re-authenticate with GitHub in Genesis

### "Terraform State Lock"
**Problem**: Another workflow is using Terraform, state is locked.

**Solutions**:
- Wait for other workflow to complete
- If workflow crashed, manually unlock: `terraform force-unlock <LOCK_ID>`
- Check S3 backend for lock file
- Cancel stuck workflow runs in GitHub Actions

### "Docker Build Failed"
**Problem**: Docker image build errors in workflow.

**Solutions**:
- Check Dockerfile syntax is correct
- Verify all dependencies are in package.json/requirements.txt
- Review workflow logs for specific error
- Test Docker build locally: `docker build -t test .`

### Workflows Not Triggering
**Problem**: Push/PR doesn't start workflow.

**Solutions**:
- Check workflow YAML has correct `on:` triggers
- Ensure workflow file is in `.github/workflows/` directory
- Verify branch names match (e.g., `main` vs `master`)
- Check if Actions are enabled: Settings → Actions → General

---

## GitHub Actions Pricing

**Free Tier** (enough for most small projects):
- **Public repositories**: Unlimited minutes
- **Private repositories**: 
  - Free plan: 2,000 minutes/month
  - Team plan: 3,000 minutes/month
  - Enterprise: 50,000 minutes/month

**Paid Usage**:
- Linux runners: $0.008/minute (~$0.48/hour)
- Larger runners available with more CPU/RAM
- Check current pricing: https://github.com/pricing

**Tips to reduce costs**:
- Use caching for dependencies (npm, pip, etc.)
- Only run workflows on specific branches
- Skip tests on draft PRs
- Use matrix strategy efficiently
- Cancel redundant workflows

---

## Best Practices

1. **Security**:
   - Never commit secrets to code
   - Use GitHub Secrets for all sensitive data
   - Review workflow logs for accidentally printed secrets
   - Rotate credentials regularly

2. **Performance**:
   - Use caching for dependencies (saves time and money)
   - Run tests in parallel with matrix strategy
   - Skip unnecessary steps with `if:` conditions
   - Use `concurrency:` to cancel redundant runs

3. **Reliability**:
   - Add retry logic for flaky tests
   - Use proper error handling in scripts
   - Set reasonable timeout limits
   - Monitor workflow success rates

4. **Maintainability**:
   - Comment complex workflow logic
   - Use reusable workflows for common tasks
   - Keep workflow files organized
   - Version pin actions: `uses: actions/checkout@v4`

---

## Workflow Examples

### Manual Deployment Trigger
You can manually trigger deployments:
1. Go to Actions tab
2. Select deployment workflow (e.g., "Deploy to Production")
3. Click "Run workflow" button
4. Select branch and environment
5. Click "Run workflow"

### Rolling Back Deployment
To rollback a bad deployment:
1. Go to Actions tab
2. Find last successful deployment workflow run
3. Click "Re-run all jobs"
4. Or manually trigger with previous git SHA

### Viewing Logs
To debug workflow failures:
1. Go to Actions tab
2. Click failed workflow run
3. Click failed job
4. Expand failed step to see logs
5. Download logs: Click "..." → "Download log archive"

---

## Additional Resources

- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **GitHub Actions Marketplace**: https://github.com/marketplace?type=actions
- **Workflow Syntax**: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **GitHub Actions Pricing**: https://github.com/pricing
- **Actions Starter Workflows**: https://github.com/actions/starter-workflows
- **Troubleshooting Guide**: https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows

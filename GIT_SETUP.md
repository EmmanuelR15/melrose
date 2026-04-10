# Git Setup Commands for MELROSE

## **Initial Repository Setup**

### **1. Initialize Git Repository**

```bash
# Navigate to project directory
cd melrose

# Initialize Git repository
git init

# Configure default branch to main
git branch -M main

# Set user information (if not configured globally)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### **2. Add Remote Repository**

```bash
# Add GitHub remote (replace with your actual repository URL)
git remote add origin https://github.com/username/melrose.git

# Verify remote configuration
git remote -v

# Test connection (optional)
git remote show origin
```

### **3. Initial Commit**

```bash
# Add all files to staging
git add .

# Check status before commit
git status

# Create initial commit
git commit -m "feat: initial commit - MELROSE e-commerce platform

- Astro 4.x with TypeScript and TailwindCSS
- Supabase integration for products and admin
- Instagram Basic Display API with fallback
- Responsive design with GSAP animations
- WhatsApp Business checkout integration
- SEO optimized with dynamic meta tags
- Performance optimized (94/100 Lighthouse score)

Co-authored-by: MELROSE Team <contact@melrose.com.ar>"
```

### **4. Push to GitHub**

```bash
# Push main branch to remote
git push -u origin main

# Verify push was successful
git status
```

---

## **Development Workflow**

### **Feature Development**

```bash
# Create new feature branch
git checkout -b feature/instagram-feed-enhancement

# Make changes and commit
git add .
git commit -m "feat: enhance Instagram feed with real-time validation

- Add automatic shortcode validation
- Implement fallback monitoring system
- Add production error logging
- Update documentation"

# Push feature branch
git push origin feature/instagram-feed-enhancement

# Create Pull Request on GitHub
```

### **Bug Fixes**

```bash
# Create bug fix branch
git checkout -b fix/responsive-mobile-layout

# Fix issues and commit
git add .
git commit -m "fix: resolve mobile layout issues on small screens

- Fix Instagram feed overflow on 360px devices
- Adjust touch targets for iOS compatibility
- Update CSS media queries for better responsive behavior"

# Push and create PR
git push origin fix/responsive-mobile-layout
```

### **Hotfixes (Production)**

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-patch

# Apply fix and commit
git add .
git commit -m "hotfix: patch security vulnerability in Supabase queries

- Add input sanitization for product search
- Validate user input in admin panel
- Update dependency with security fix"

# Push and merge
git push origin hotfix/critical-security-patch
# Merge to main and create release tag
```

---

## **Repository Maintenance**

### **Regular Maintenance**

```bash
# Check repository status
git status

# Clean up untracked files
git clean -fd

# Remove stale branches
git remote prune origin
git branch -d feature/completed-feature

# Check for large files
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | tail -10
```

### **Tagging Releases**

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release v1.0.0 - Initial MELROSE Platform

Features:
- Complete e-commerce functionality
- Instagram integration with fallback
- Responsive design for all devices
- Admin panel for product management
- WhatsApp checkout integration
- SEO optimization and performance tuning"

# Push tags to remote
git push origin v1.0.0
git push --tags

# List all tags
git tag -l
```

---

## **Best Practices**

### **Commit Message Convention**

```bash
# Format: type(scope): description

# Types:
# feat:     New feature
# fix:      Bug fix
# docs:     Documentation changes
# style:    Code style changes (formatting, etc.)
# refactor: Code refactoring
# test:     Adding or updating tests
# chore:    Maintenance tasks
# perf:     Performance improvements
# security: Security fixes

# Examples:
git commit -m "feat(instagram): add real-time feed monitoring"
git commit -m "fix(mobile): resolve touch target issues on iOS"
git commit -m "docs(readme): update installation instructions"
git commit -m "perf(optimization): reduce bundle size by 15%"
```

### **Branch Naming Convention**

```bash
# Feature branches: feature/description
git checkout -b feature/instagram-feed-enhancement

# Bug fix branches: fix/description
git checkout -b fix/responsive-mobile-issues

# Hotfix branches: hotfix/description
git checkout -b hotfix/critical-security-patch

# Release branches: release/version
git checkout -b release/v1.1.0

# Documentation branches: docs/description
git checkout -b docs/api-documentation
```

### **Pull Request Guidelines**

```bash
# Before creating PR:
# 1. Ensure branch is up to date
git checkout main
git pull origin main
git checkout feature/your-branch
git rebase main

# 2. Run tests and linting
npm run test
npm run lint
npm run build

# 3. Check for merge conflicts
git merge main --no-commit --no-ff

# 4. Create PR with detailed description
# Include:
# - Problem statement
# - Solution approach
# - Testing performed
# - Screenshots if applicable
# - Breaking changes (if any)
```

---

## **Troubleshooting**

### **Common Issues**

**Push rejected (non-fast-forward):**
```bash
# Pull latest changes first
git pull origin main

# Then push your changes
git push origin main
```

**Merge conflicts:**
```bash
# Check conflicted files
git status

# Resolve conflicts manually
# Then stage resolved files
git add conflicted-file.js

# Continue merge
git commit -m "resolve: merge conflicts in Instagram component"
```

**Accidentally committed sensitive data:**
```bash
# Remove file from history
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .env' \
--prune-empty --tag-name-filter cat -- --all

# Force push (use with caution!)
git push --force-with-lease origin main
```

**Undo last commit:**
```bash
# Soft reset (keep changes)
git reset --soft HEAD~1

# Hard reset (discard changes)
git reset --hard HEAD~1
```

### **Repository Recovery**

```bash
# Check repository integrity
git fsck --full

# Repair broken repository
git gc --prune=now --aggressive

# Recover lost commits
git reflog
git checkout <commit-hash>
```

---

## **Security Considerations**

### **Prevent Sensitive Data Exposure**

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Remove accidentally committed secrets
git filter-repo --path .env --invert-paths

# Set up pre-commit hook
echo "#!/bin/sh
# Check for sensitive files
if git diff --cached --name-only | grep -E '\.(env|key|pem|p12)$'; then
  echo 'Error: Attempting to commit sensitive file'
  exit 1
fi" > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### **Branch Protection**

```bash
# Configure protected branches (GitHub CLI)
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

---

## **Automation Scripts**

### **Setup Script**

```bash
#!/bin/bash
# setup-git.sh - Automated Git setup for MELROSE

echo "Setting up Git repository for MELROSE..."

# Initialize repository
git init
git branch -M main

# Add remote (replace with actual URL)
git remote add origin https://github.com/username/melrose.git

# Create .gitignore if not exists
if [ ! -f .gitignore ]; then
  echo "Creating .gitignore..."
  cat > .gitignore << EOF
# Dependencies
node_modules/
dist/
.astro/

# Environment variables
.env
.env.*
!.env.example

# OS files
.DS_Store
Thumbs.db
EOF
fi

# Initial commit
git add .
git commit -m "feat: initial commit - MELROSE e-commerce platform"

# Push to remote
git push -u origin main

echo "Git setup complete! Repository ready for development."
```

### **Release Script**

```bash
#!/bin/bash
# release.sh - Automated release process

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: ./release.sh v1.0.0"
  exit 1
fi

echo "Creating release $VERSION..."

# Update version in package.json
npm version $VERSION --no-git-tag-version

# Commit version change
git add package.json
git commit -m "chore: bump version to $VERSION"

# Create tag
git tag -a $VERSION -m "Release $VERSION"

# Push to remote
git push origin main
git push origin $VERSION

echo "Release $VERSION created successfully!"
```

---

**Follow these commands to properly set up and maintain the MELROSE Git repository with best practices for collaboration and version control.**

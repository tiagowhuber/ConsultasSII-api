# GitHub Actions Scheduler Setup Guide

This guide will help you set up the automated SII data fetching using GitHub Actions instead of a local scheduler that won't work on serverless platforms like Vercel or Netlify.

## 🚀 Quick Setup Checklist

### 1. Repository Configuration
- ✅ GitHub Actions workflow file created (`.github/workflows/sii-scheduler.yml`)
- ✅ Authentication middleware implemented
- ✅ Protected API endpoints configured

### 2. GitHub Repository Settings

#### **Secrets (Repository Settings → Secrets and variables → Actions → Secrets)**
```
API_BASE_URL = https://your-app.vercel.app  (or your deployed URL)
SCHEDULER_SECRET = your-super-secret-scheduler-key-here
```

#### **Variables (Repository Settings → Secrets and variables → Actions → Variables)**
```
ENABLE_SCHEDULER = true
```

### 3. Deployment Environment Variables

Add these to your **Vercel/Netlify** environment variables:
```bash
SCHEDULER_SECRET=your-super-secret-scheduler-key-here
NODE_ENV=production
```

## 📅 Schedule Details

The scheduler runs **4 times per day** on **business days only** (Monday-Friday):

- **8:00 AM** Chilean Time (11:00 UTC winter / 12:00 UTC summer)
- **11:00 AM** Chilean Time (14:00 UTC winter / 15:00 UTC summer)  
- **1:00 PM** Chilean Time (16:00 UTC winter / 17:00 UTC summer)
- **4:00 PM** Chilean Time (19:00 UTC winter / 20:00 UTC summer)

## 🔧 API Endpoints

### Protected Endpoints (Require Authentication)
- `POST /api/sii/fetch-and-store/:year/:month` - Fetch and store SII data
- `GET /api/scheduler/status` - Get scheduler status

### Public Endpoints  
- `GET /api/scheduler/health` - Health check
- `POST /api/scheduler/test` - Test authentication (development only)

## 🔐 Authentication

In **production**, the `/fetch-and-store` endpoint requires authentication:

```bash
curl -X POST "https://your-app.vercel.app/api/sii/fetch-and-store/2025/09" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-super-secret-scheduler-key-here"
```

In **development**, authentication is bypassed for easier testing.

## 🧪 Testing

### 1. Test API Health
```bash
curl https://your-app.vercel.app/api/scheduler/health
```

### 2. Test Authentication (Development)
```bash
curl -X POST "http://localhost:3000/api/scheduler/test" \
  -H "Authorization: Bearer your-super-secret-scheduler-key-here"
```

### 3. Manual GitHub Actions Trigger
1. Go to your repository → Actions → "SII Data Scheduler"
2. Click "Run workflow"
3. Optionally specify year/month or leave blank for current month

## 🔧 Configuration

### Enable/Disable Scheduler
1. Go to repository → Settings → Secrets and variables → Actions → Variables
2. Set `ENABLE_SCHEDULER` to `true` or `false`
3. The workflow will automatically respect this setting

### Change Schedule Times
Edit `.github/workflows/sii-scheduler.yml` and modify the cron expressions:

```yaml
schedule:
  - cron: '0 11 * * 1-5'  # 8AM Chilean (11AM UTC winter)
  - cron: '0 14 * * 1-5'  # 11AM Chilean (2PM UTC winter)
  # Add more times as needed
```

## 🐛 Troubleshooting

### Check GitHub Actions Logs
1. Go to repository → Actions
2. Click on the latest workflow run
3. Check the logs for detailed error messages

### Common Issues

#### 401 Unauthorized
- Check that `SCHEDULER_SECRET` matches in both GitHub Secrets and deployment environment
- Verify the Authorization header format: `Bearer <token>`

#### 404 Not Found  
- Verify `API_BASE_URL` in GitHub Secrets points to your deployed app
- Check that your app is deployed and accessible

#### Workflow Not Running
- Check that `ENABLE_SCHEDULER` variable is set to `true`
- Verify the cron schedule is correct for your timezone

#### Business Days Logic
The workflow automatically skips weekends. For holidays, you'd need to add additional date checking logic.

## 📊 Monitoring

### View Execution History
- Repository → Actions → "SII Data Scheduler"
- See all past executions, success/failure status, and logs

### API Status Endpoint
```bash
curl -H "Authorization: Bearer your-secret" \
  https://your-app.vercel.app/api/scheduler/status
```

## 🔄 Migration from Old Scheduler

The old `node-cron` scheduler has been completely removed:
- ❌ `src/services/scheduler.ts` (deleted)
- ❌ `node-cron` dependency (removed)
- ❌ Local cron tasks (not serverless-compatible)
- ✅ GitHub Actions workflow (serverless-friendly)
- ✅ Authentication middleware (security)
- ✅ Health monitoring endpoints

## 💡 Benefits of GitHub Actions

- ✅ **Serverless Compatible**: Works with Vercel, Netlify, etc.
- ✅ **Free**: No additional cost for public repositories
- ✅ **Reliable**: GitHub's infrastructure ensures execution
- ✅ **Monitoring**: Built-in logs and execution history
- ✅ **Flexible**: Easy to modify schedule or disable
- ✅ **Secure**: Token-based authentication
- ✅ **Manual Control**: Can trigger manually when needed

## 🎯 Next Steps

1. **Deploy your app** to Vercel/Netlify with the updated code
2. **Set up GitHub repository secrets** and variables
3. **Test manually** using the workflow dispatch feature
4. **Monitor execution** in the Actions tab
5. **Customize schedule** if needed for your specific requirements
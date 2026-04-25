# Backend Deployment to Vercel with PostgreSQL

## Architecture
- **Backend**: Vercel (Serverless Node.js)
- **Database**: PostgreSQL (Neon Cloud)
- **Frontend**: Vercel
- **Data**: ✅ Persistent (stored in Neon PostgreSQL)

## Prerequisites
- Vercel account (https://vercel.com)
- Neon account (https://neon.tech) - FREE
- Git repository with your code

## Step 1: Set Up PostgreSQL Database on Neon

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up (free tier available)

2. **Create New Project**
   - Click "New Project"
   - Choose a region closest to your users
   - Project created! You'll see a connection string

3. **Get Connection String**
   - Go to "Connection Details" in your Neon project
   - Copy the full connection string that looks like:
   ```
   postgresql://user:password@ep-cool-db-123456.us-east-1.neon.tech/neondb?sslmode=require
   ```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from server directory
cd server
vercel

# Follow prompts:
# - Link to existing Vercel project (if you have one)
# - Root directory: . (current directory)
# - Build command: leave blank
# - Output directory: leave blank
```

### Option B: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Root Directory**: Select `server` folder
5. **Skip Build Step** (no build needed)
6. Click "Deploy"

## Step 3: Set Environment Variables in Vercel

After deployment, go to your project settings on Vercel:

1. **Project Settings** → **Environment Variables**
2. Add these variables:

```
DATABASE_URL=postgresql://user:password@your-neon-host/database?sslmode=require
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

**Copy the DATABASE_URL** from your Neon project connection details.

3. Click "Save"
4. **Redeploy** to apply environment variables:
   - Go to Deployments
   - Click "Redeploy" on the latest deployment

## Step 4: Update Frontend with Backend URL

In your frontend code (React), update the API base URL:

```javascript
// src/services/api.js or wherever you make API calls
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// OR set directly
const API_URL = 'https://your-backend-name.vercel.app';

export const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  return response.json();
};
```

Or in `.env.local` (frontend):
```
REACT_APP_API_URL=https://your-backend-name.vercel.app
```

## Step 5: Test Your Deployment

### Health Check
```bash
curl https://your-backend-name.vercel.app/api/health
# Should return: {"status":"ok","message":"Backend is running"}
```

### Test Login (Default Admin)
```bash
curl -X POST https://your-backend-name.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@businessapp.com","password":"admin123"}'
```

You should receive a JWT token in the response.

### Test from Frontend
1. Navigate to your frontend URL
2. Try logging in with: **admin@businessapp.com** / **admin123**
3. If successful, your frontend and backend are connected! ✅

## Local Development Setup

To test PostgreSQL locally before deploying:

### 1. Install PostgreSQL
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

### 2. Create Local Database
```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell, create database
CREATE DATABASE businessapp;
\q
```

### 3. Update .env File
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/businessapp
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run Backend
```bash
npm run dev
```

The tables will be created automatically on first run! ✅

## Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` in Vercel environment variables
- Ensure it matches your deployed frontend domain exactly

### Database Connection Error
- Verify `DATABASE_URL` is correct in Vercel environment variables
- Ensure SSL mode is set (most cloud databases require this)
- Check Neon firewall settings allow Vercel IPs

### 502 Bad Gateway
- Check Vercel logs: **Deployments** → **Functions** → check error logs
- Ensure all environment variables are set
- Check that tables were created successfully

### Connection Timeout
- Verify DATABASE_URL format is correct
- Check Neon project is still active
- Try connecting from local machine first

## Database Operations

### View Database in Neon
1. Go to your Neon project
2. Click "Tables" to see your data
3. You can query and manage data directly

### Backup Your Data
- Neon automatically creates backups
- Use `pg_dump` to manually export:
```bash
pg_dump "postgresql://user:password@host/database" > backup.sql
```

### Scale or Upgrade
- Neon free tier includes 1 compute unit
- Upgrade anytime in Neon project settings

## Security Notes ⚠️

1. **Never** commit `.env` files to git
2. **Never** expose JWT_SECRET
3. Use strong passwords in DATABASE_URL
4. Rotate JWT_SECRET periodically in production
5. Enable Neon IP whitelisting for additional security

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **PostgreSQL**: https://www.postgresql.org/docs/

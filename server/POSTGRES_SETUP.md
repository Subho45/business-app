# PostgreSQL Setup Guide

## Quick Start for Local Development

### 1. Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run installer, remember the password you set for `postgres` user
- PostgreSQL will be installed with port 5432

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Create Database and User

**Windows (using pgAdmin after installation):**
- Open pgAdmin
- Right-click "Databases" → "Create" → "Database"
- Name: `businessapp`

**Mac/Linux (using terminal):**
```bash
# Connect to PostgreSQL
psql -U postgres

# In the PostgreSQL prompt:
CREATE DATABASE businessapp;
CREATE USER businessapp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE businessapp TO businessapp_user;
\q
```

### 3. Get Your Connection String

Replace with your actual values:
```
postgresql://businessapp_user:your_password@localhost:5432/businessapp
```

### 4. Set Up Local .env File

Create `.env` in `server/` directory:
```
DATABASE_URL=postgresql://businessapp_user:your_password@localhost:5432/businessapp
JWT_SECRET=your_secret_key_here_change_in_production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Run Backend

```bash
cd server
npm install          # Install dependencies
npm run dev         # Start with nodemon
```

You should see:
```
✅ Database initialized successfully
🚀 Server running on http://localhost:5000
```

### 6. Test Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Login with default admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@businessapp.com","password":"admin123"}'
```

## Viewing Your Data

**Using psql:**
```bash
psql -U businessapp_user -d businessapp -h localhost

# View tables
\dt

# View users
SELECT * FROM users;

# View contacts
SELECT * FROM contacts;

# Exit
\q
```

**Using pgAdmin (GUI):**
- Open pgAdmin in browser (usually http://localhost:5050)
- Navigate to Servers → PostgreSQL → Databases → businessapp → Tables
- Right-click any table → "View/Edit Data" → "All Rows"

## Useful Commands

```bash
# Connect to database
psql -U postgres -d businessapp

# Backup database
pg_dump -U businessapp_user businessapp > backup.sql

# Restore from backup
psql -U businessapp_user businessapp < backup.sql

# Drop all data (fresh start)
psql -U businessapp_user -d businessapp -c "DROP TABLE IF EXISTS contacts CASCADE; DROP TABLE IF EXISTS users CASCADE;"

# Reset and reinitialize
# Stop server, run above drop command, restart server
```

## Troubleshooting

**Connection refused**
- Ensure PostgreSQL service is running
- Check default port is 5432: `sudo lsof -i :5432` (Mac/Linux) or `netstat -ano | findstr :5432` (Windows)

**Password authentication failed**
- Verify DATABASE_URL has correct username/password
- Check `.env` file exists in `server/` directory
- Restart backend after changing .env

**Table creation fails**
- Check user has proper permissions
- Try running: `GRANT ALL PRIVILEGES ON DATABASE businessapp TO businessapp_user;`

**Port 5432 already in use**
- Change port in DATABASE_URL to 5433, 5434, etc.
- Update PostgreSQL config to use different port

## Next Steps

1. ✅ Test locally with `npm run dev`
2. ✅ Test all API endpoints
3. ✅ Connect frontend to `http://localhost:5000`
4. ✅ Once working, deploy to Vercel using `DEPLOYMENT.md`

# Deployment Guide - Student Wellness Management System

## Local Development Setup

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Git
- Visual Studio Code (recommended)

### Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project
4. Create a cluster (Free Tier)
5. Add a database user with username and password
6. Whitelist your IP address (or 0.0.0.0/0 for development)
7. Get connection string and format it:
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
   ```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add:
MONGODB_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_secret_key_at_least_32_characters
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

Frontend will run on: `http://localhost:3000`

### Step 4: Testing

1. Open http://localhost:3000
2. Click "Register" to create an account
3. Test different roles (Student, Doctor, Pharmacist)
4. Login with created credentials

## Production Deployment

### Option 1: Deploy on Vercel (Frontend) + Render (Backend)

#### Backend Deployment on Render

1. Create [Render](https://render.com) account
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables from .env
5. Deploy

#### Frontend Deployment on Vercel

1. Create [Vercel](https://vercel.com) account
2. Import GitHub project
3. Configure:
   - Framework: Next.js
   - Build command: `npm run build`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=your_render_backend_url
   ```
5. Deploy

### Option 2: Deploy on Heroku (Backend)

```bash
# Install Heroku CLI
brew install heroku

# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set FRONTEND_URL=your_frontend_url
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Option 3: Docker Deployment

#### Dockerfile for Backend

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Dockerfile for Frontend

```dockerfile
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: http://frontend:3000
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000
    depends_on:
      - backend

  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## Environment Variables Reference

### Backend (.env)

```
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Security
JWT_SECRET=your_secret_key_minimum_32_characters_long

# Server
PORT=5000
NODE_ENV=production

# CORS
FRONTEND_URL=https://yourdomain.com

# Email (optional)
SMTP_USER=your_email
SMTP_PASS=your_password
SMTP_HOST=smtp.gmail.com
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## SSL Certificate Setup

### Using Let's Encrypt with Nginx

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Monitoring & Logging

### Backend Logging Setup

Add to server.js:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Database Backup

```bash
# Backup MongoDB
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/dbname" --out ./backup

# Restore MongoDB
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/dbname" ./backup
```

## Performance Optimization

### Frontend

1. Enable gzip compression
2. Optimize images
3. Implement lazy loading
4. Cache static assets
5. Minify CSS/JS

### Backend

1. Add database indexing
2. Implement request caching
3. Use connection pooling
4. Compress responses
5. Add rate limiting

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Password hashing verified
- [ ] API keys rotated regularly

## Troubleshooting

### MongoDB Connection Failed
```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Ensure credentials are correct
```

### CORS Errors
```bash
# Verify FRONTEND_URL in backend .env
# Check browser console for exact error
# Add required headers in middleware
```

### Performance Issues
```bash
# Check database indexing
# Monitor API response times
# Implement caching
# Use CDN for static assets
```

## Scaling Considerations

1. **Database**: Upgrade MongoDB Atlas tier
2. **Backend**: Use load balancer (Nginx/HAProxy)
3. **Frontend**: Use CDN (Cloudflare/Vercel)
4. **Caching**: Implement Redis
5. **Sessions**: Use distributed session store

## Maintenance

- Regular security updates
- Database backups (daily)
- Log rotation
- Performance monitoring
- User support system
- Bug tracking

## Support & Documentation

- Check README.md for API documentation
- Review .env.example for configuration
- Check server logs for errors
- Monitor MongoDB Atlas dashboard

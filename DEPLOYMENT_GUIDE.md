# Deployment & Scalability Guide

## Local Development Setup

### Prerequisites
- Node.js v14+
- MongoDB running locally or MongoDB Atlas account
- npm or yarn

### Steps

1. **Backend**
```bash
cd backend
npm install
# Update .env with your MongoDB URI
npm run dev  # For development with hot reload
# or
npm start    # For production
```

2. **Frontend**
```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

## Deployment on Heroku

### Backend Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Initialize Git and Login**
```bash
git init
heroku login
```

3. **Create Heroku App**
```bash
heroku create your-app-name
```

4. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGODB_URI=your_mongodb_uri
```

5. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Update API URL in Frontend**
In `frontend/src/pages/Login.jsx`, `Register.jsx`, etc., update:
```javascript
// From:
'http://localhost:3000/api/...'

// To:
'https://your-heroku-app.herokuapp.com/api/...'
```

3. **Deploy**
```bash
cd frontend
vercel
```

---

## Scalability Improvements

### 1. Database Optimization
```javascript
// Add indexes to frequently queried fields
postSchema.index({ userId: 1, createdAt: -1 });
userSchema.index({ email: 1 });
```

### 2. Implement Pagination
```javascript
// In backend routes/posts.js
postRouter.get("/v1/posts", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const posts = await postModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    
    const total = await postModel.countDocuments();
    
    return res.status(200).json({
        success: true,
        posts,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit)
        }
    });
});
```

### 3. Implement Caching with Redis
```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

postRouter.get("/v1/posts", async (req, res) => {
    // Check cache first
    const cachedPosts = await client.get('all_posts');
    if (cachedPosts) {
        return res.status(200).json({
            success: true,
            posts: JSON.parse(cachedPosts),
            cached: true
        });
    }
    
    const posts = await postModel.find();
    
    // Set cache for 1 hour
    await client.setEx('all_posts', 3600, JSON.stringify(posts));
    
    return res.status(200).json({
        success: true,
        posts
    });
});
```

### 4. Implement Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 5. Implement Logging
```bash
npm install morgan winston
```

```javascript
const morgan = require('morgan');
const logger = require('./utils/logger');

app.use(morgan('combined', { stream: logger.stream }));
```

### 6. Dockerization
Create `Dockerfile`:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/project_db
      - JWT_SECRET=your_secret
    depends_on:
      - mongodb

volumes:
  mongo-data:
```

### 7. Add API Versioning Strategy
- Current: `/api/v1/*`
- Future: Introduce `/api/v2/*` when breaking changes needed
- Keep `/api/v1/*` for backward compatibility

### 8. Implement CORS Properly for Production
```javascript
const cors = require('cors');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
```

### 9. Use Environment-Based Configuration
```javascript
const config = {
    development: {
        mongodb_uri: 'mongodb://localhost:27017/project_dev',
        jwt_expiry: '7d',
        api_url: 'http://localhost:3000'
    },
    production: {
        mongodb_uri: process.env.MONGODB_URI,
        jwt_expiry: '7d',
        api_url: process.env.API_URL
    }
};
```

### 10. Implement Request Validation Middleware
```bash
npm install joi
```

```javascript
const Joi = require('joi');

const validatePost = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        caption: Joi.string().optional()
    });
    
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    
    next();
};
```

---

## Performance Monitoring

### Using New Relic
```bash
npm install newrelic
```

Add to top of `server.js`:
```javascript
require('newrelic');
```

### Using Datadog
Implement APM monitoring for production tracking.

---

## Database Replication for HA

For production, set up MongoDB Replica Sets:
```
mongodb+srv://user:password@cluster.mongodb.net/database?replicaSet=atlas-xxxxx&retryWrites=true
```

---

## CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        run: |
          git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git main
```

---

## Monitoring & Alerts

- **Uptime Monitoring**: Use Uptimerobot
- **Error Tracking**: Sentry
- **Performance**: Newrelic or Datadog
- **Logs**: CloudWatch or Elastic Stack

---

## Security Checklist for Production

- ✅ Use HTTPS/SSL certificates
- ✅ Implement CSRF protection
- ✅ Set secure HTTP headers
- ✅ Use helmet.js
- ✅ Validate all inputs
- ✅ Use environment variables for secrets
- ✅ Implement DDoS protection
- ✅ Regular security audits
- ✅ Keep dependencies updated
- ✅ Implement role-based access control

```bash
npm install helmet express-validator
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## Auto-Scaling Configuration

### For Heroku
```bash
heroku ps:scale web=2 worker=1
```

### For Kubernetes
- Use horizontal pod autoscaler
- Set resource limits
- Implement health checks

---

## Expected Performance Metrics

- Response Time: < 200ms
- Error Rate: < 0.1%
- Database Connection Pool: 20-50
- Max Concurrent Users: 1000+

---

## Troubleshooting Production Issues

| Issue | Solution |
|-------|----------|
| Memory leak | Profile with clinic.js or Node Inspector |
| Slow queries | Add database indexes |
| 502 Bad Gateway | Check app logs, restart dyno |
| High latency | Implement caching, add more dynos |
| Database connection errors | Check connection pool, verify URI |

---

## Future Roadmap

- [ ] Implement microservices architecture
- [ ] Add GraphQL API alongside REST
- [ ] Implement real-time notifications with WebSocket
- [ ] Add message queuing (RabbitMQ/Kafka)
- [ ] Implement search indexing (Elasticsearch)
- [ ] Add file storage (S3/Google Cloud)

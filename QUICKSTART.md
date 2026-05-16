# Gospel Backend - Quick Start & Deployment Guide

## ✅ Installation Status
- ✅ Node.js dependencies installed (612 packages)
- ✅ Core modules configured
- ✅ Database schemas created
- ✅ API routes ready
- ✅ WebSocket support enabled
- ✅ Docker configuration ready

## 🚀 Quick Start (5 minutes)

### 1. Start MongoDB
```bash
# Option A: Local installation
mongod

# Option B: Docker
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

### 2. Configure Environment
```bash
# Edit .env with your MongoDB URI
MONGODB_URI=mongodb://localhost:27017/gospel_platform
JWT_SECRET=your-secret-key-here
```

### 3. Seed Sample Data (Optional)
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs at: **http://localhost:3000**

### 5. Test API
```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "password":"password123"
  }'
```

## 📦 Production Deployment

### Docker Compose (Recommended)
```bash
docker-compose up -d
```

This starts:
- Node.js backend (port 3000)
- MongoDB (port 27017)
- Redis cache (port 6379)

### Manual Docker Build
```bash
# Build image
docker build -t gospel-backend:1.0 .

# Run container
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://host:27017/gospel_platform \
  -e JWT_SECRET=production-secret \
  -e NODE_ENV=production \
  gospel-backend:1.0
```

### Cloud Deployment (Heroku, AWS, DigitalOcean)
```bash
# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## 📋 Environment Variables Checklist

### Required
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - JWT signing secret (minimum 32 characters)
- [ ] `NODE_ENV` - Set to 'production' for live deployment

### Optional
- [ ] `PORT` - Server port (default: 3000)
- [ ] `CLOUDINARY_*` - Cloud file storage
- [ ] `SMTP_*` - Email service configuration
- [ ] `REDIS_URL` - Cache configuration

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production in production
- [ ] Use HTTPS in production
- [ ] Enable MongoDB authentication
- [ ] Configure CORS whitelist in .env
- [ ] Set up rate limiting (already configured)
- [ ] Enable HTTPS/TLS
- [ ] Use strong database passwords
- [ ] Regular backups of MongoDB
- [ ] Monitor logs for errors

## 📊 API Endpoints Summary

### Authentication (No token required)
```
POST   /api/auth/register
POST   /api/auth/login
```

### Content (Requires token for write)
```
GET    /api/content                 # List all (public)
GET    /api/content/:id             # Get details (public)
POST   /api/content                 # Create (creator/admin)
PUT    /api/content/:id             # Update (owner/admin)
DELETE /api/content/:id             # Delete (owner/admin)
POST   /api/content/:id/like        # Like (authenticated)
```

### Chat (Requires token)
```
GET    /api/chat/:contentId/messages
POST   /api/chat/:contentId/messages
DELETE /api/chat/messages/:messageId
```

### User (Requires token)
```
GET    /api/auth/me                 # Get profile
PUT    /api/auth/profile            # Update profile
```

## 🔌 WebSocket Events

```javascript
// Connect
const socket = io('http://localhost:3000');

// Join content room
socket.emit('join-content', contentId, userId);

// Send message
socket.emit('new-message', contentId, {
  author: userId,
  message: 'Hello!',
  timestamp: Date.now()
});

// Listen for new messages
socket.on('message', (msg) => console.log(msg));

// Leave room
socket.emit('leave-content', contentId, userId);
```

## 📁 Project Structure

```
GospelBackend/
├── src/
│   ├── config/           # Configuration & DB connection
│   ├── models/           # MongoDB schemas (User, Content, ChatMessage, Like)
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, validation, errors
│   ├── sockets/          # WebSocket handlers
│   ├── utils/            # Helper functions
│   └── index.js          # App entry point
├── scripts/
│   └── seed.js           # Database seeding
├── docker-compose.yml    # Container orchestration
├── Dockerfile            # Container image
├── package.json
├── .env                  # Environment variables
└── README.md
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongod --version

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/gospel_platform
```

### Port 3000 Already in Use
```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac: 
lsof -ti:3000 | xargs kill -9
```

### Dependencies Missing
```bash
rm -rf node_modules package-lock.json
npm install
```

### JWT Authentication Errors
- Ensure JWT_SECRET is set in .env
- Token must be sent as: `Authorization: Bearer <token>`
- Check token hasn't expired (default: 7 days)

## 📈 Performance Optimization

- ✅ MongoDB indexes on frequently queried fields
- ✅ Response compression (gzip)
- ✅ Connection pooling
- ✅ Pagination support (limit/offset)
- ✅ Caching strategies with Node-cache
- ✅ Async/await for non-blocking operations
- ✅ WebSocket for real-time updates

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- auth.test.js

# Generate coverage report
npm test -- --coverage
```

## 📚 Documentation Files

- **README.md** - Project overview
- **SETUP.md** - Detailed setup instructions
- **INTEGRATION_GUIDE.md** - Flutter app integration
- **API documentation** - In code comments

## 🔄 Continuous Integration/Deployment

GitLab CI/CD pipeline configured in `.gitlab-ci.yml`:
- Linting on merge requests
- Automated testing
- Docker image building
- Production deployment

## 📞 Support & Monitoring

### Logs Location
```
logs/
├── info.log     # Application information
├── error.log    # Error logs
├── warn.log     # Warning logs
└── debug.log    # Debug information
```

### Health Check
```bash
curl http://localhost:3000/health
```

### Monitor Dependencies
```bash
npm outdated        # Check for outdated packages
npm audit           # Security vulnerabilities
npm audit fix       # Auto fix vulnerabilities
```

## 🎯 Next Steps

1. **Configure MongoDB** - Use local or cloud (MongoDB Atlas)
2. **Set Environment Variables** - Update .env with real values
3. **Test API** - Use provided curl examples or Postman
4. **Integrate Flutter App** - Follow INTEGRATION_GUIDE.md
5. **Deploy** - Use Docker Compose or cloud platform
6. **Monitor** - Check logs and performance metrics

## 🚀 Deployment Platforms Ready

This backend is production-ready for:
- Heroku
- AWS (EC2, ECS, Lambda)
- DigitalOcean
- Google Cloud Run
- Azure App Service
- Docker Swarm/Kubernetes

Choose your platform and follow the provider's deployment guide with the included Dockerfile.

---

**Last Updated:** May 16, 2026
**Status:** Production Ready ✅

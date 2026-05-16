# Gospel Backend - Production-Ready Setup Checklist

## Overview
This is a production-ready Node.js backend for the Gospel multimedia streaming platform.

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy and configure environment variables
cp .env .env.local
# Edit .env.local with your actual values
```

### 3. Database Setup

#### Option A: Local MongoDB
```bash
# Make sure MongoDB is running locally
npm run seed    # Seed sample data
```

#### Option B: Docker Compose
```bash
docker-compose up -d
```

### 4. Development
```bash
npm run dev
```

### 5. Production Build
```bash
npm install --production
NODE_ENV=production npm start
```

## Project Structure

```
GospelBackend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── config.js        # Environment config
│   │   └── database.js      # MongoDB connection
│   ├── models/              # Database schemas
│   │   ├── User.js
│   │   ├── Content.js
│   │   ├── ChatMessage.js
│   │   └── Like.js
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   ├── contentController.js
│   │   └── chatController.js
│   ├── routes/              # API endpoints
│   │   ├── auth.js
│   │   ├── content.js
│   │   └── chat.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── validation.js    # Input validation
│   │   └── errorHandler.js  # Error handling
│   ├── sockets/             # WebSocket handlers
│   │   └── chatSocket.js    # Real-time chat
│   ├── utils/               # Utility functions
│   │   ├── errors.js        # Custom error classes
│   │   ├── logger.js        # Logging utility
│   │   └── jwt.js           # JWT operations
│   └── index.js             # App entry point
├── scripts/
│   └── seed.js              # Database seeding script
├── docker-compose.yml       # Docker compose config
├── Dockerfile               # Docker image config
├── package.json
├── .env                     # Environment variables
├── .gitignore
└── README.md

```

## API Documentation

### Authentication Endpoints
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
PUT    /api/auth/profile       - Update profile
```

### Content Endpoints
```
GET    /api/content            - List all content
GET    /api/content/:id        - Get content details
POST   /api/content            - Create content (creator/admin)
PUT    /api/content/:id        - Update content (owner/admin)
DELETE /api/content/:id        - Delete content (owner/admin)
POST   /api/content/:id/like   - Like/unlike content
```

### Chat Endpoints
```
GET    /api/chat/:contentId/messages       - Get chat messages
POST   /api/chat/:contentId/messages       - Send message
DELETE /api/chat/messages/:messageId       - Delete message
```

### WebSocket Events
```
join-content      - Join content room
leave-content     - Leave content room
new-message       - Broadcast new message
like-update       - Update likes count
view-update       - Update views count
typing            - Show typing indicator
stop-typing       - Hide typing indicator
```

## Security Features

✅ **JWT Authentication** - Secure token-based authentication
✅ **Password Hashing** - Bcrypt with configurable rounds
✅ **CORS Protection** - Origin whitelisting
✅ **Helmet** - Security headers
✅ **Rate Limiting** - DDoS protection (100 requests per 15 minutes)
✅ **Input Validation** - Express-validator with Joi
✅ **Error Handling** - Comprehensive error middleware
✅ **SQL Injection Prevention** - Mongoose parameterized queries
✅ **XSS Protection** - Input sanitization

## Performance Optimizations

✅ **MongoDB Indexing** - Indexes on frequently queried fields
✅ **Response Compression** - Gzip compression enabled
✅ **Connection Pooling** - Mongoose connection pooling
✅ **Pagination** - Efficient data fetching with limit/offset
✅ **Caching** - Node-cache for frequently accessed data
✅ **Async Operations** - Non-blocking I/O operations
✅ **WebSocket** - Real-time updates without polling

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth.test.js
```

## Deployment

### Docker
```bash
# Build image
docker build -t gospel-backend:latest .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://... \
  -e JWT_SECRET=... \
  gospel-backend:latest
```

### Docker Compose
```bash
docker-compose up -d
```

### Kubernetes
See `k8s/` directory for Kubernetes manifests.

## Monitoring & Logging

- Logs saved to `logs/` directory
- Separate files for info, error, warn, debug levels
- Real-time logging to console in development
- Structured logging with timestamps

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - development|production
- `PORT` - Server port (default: 3000)

### Optional
- `CLOUDINARY_*` - Cloud storage
- `SMTP_*` - Email configuration
- `REDIS_URL` - Redis cache
- `LOG_LEVEL` - Logging level

## Common Issues

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify network access

### Port 3000 Already in Use
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/name`
4. Create Pull Request

## License

MIT

## Support

For issues or questions:
1. Check this documentation
2. Review error logs in `logs/` directory
3. Check MongoDB connection
4. Run: `npm run dev` for debugging

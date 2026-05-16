# Gospel Backend - Production-Ready API

A high-performance Node.js + Express backend for the Gospel multimedia streaming platform supporting video, audio, books, and live sessions.

## Features

- ✅ RESTful API with comprehensive endpoints
- ✅ JWT authentication & authorization
- ✅ MongoDB for persistent data storage
- ✅ Real-time chat via WebSocket (Socket.IO)
- ✅ File uploads with image optimization
- ✅ Rate limiting & security headers
- ✅ Input validation & error handling
- ✅ Comprehensive logging
- ✅ Docker support
- ✅ Production-ready configuration

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5+
- npm or yarn

### Installation

```bash
cd GospelBackend
npm install
```

### Environment Configuration

Copy `.env` and update with your values:

```bash
cp .env .env.local
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Production Build

```bash
npm install --production
NODE_ENV=production npm start
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token

### Content Management
- `GET /api/content` - List all content
- `GET /api/content/:id` - Get content details
- `POST /api/content` - Create content (admin)
- `PUT /api/content/:id` - Update content (admin)
- `DELETE /api/content/:id` - Delete content (admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/follow/:id` - Follow creator

### Chat & Comments
- `GET /api/chat/messages/:contentId` - Get messages
- `POST /api/chat/messages` - Send message

### Live Sessions
- `GET /api/live` - List live sessions
- `POST /api/live` - Create live session (admin)
- `DELETE /api/live/:id` - End live session

## Database Models

- **User** - Authentication & profiles
- **Content** - Videos, music, books, live sessions
- **ChatMessage** - Real-time chat messages
- **Like** - User engagement tracking
- **Follow** - Creator subscriptions

## Project Structure

```
src/
├── config/          # Configuration & database
├── models/          # Database schemas
├── routes/          # API endpoints
├── controllers/     # Business logic
├── middleware/      # Auth, validation, logging
├── services/        # Reusable services
├── utils/           # Helpers & utilities
├── sockets/         # WebSocket handlers
└── index.js         # Application entry

scripts/
├── seed.js          # Database seeding
└── setup.js         # Initial setup

tests/               # Unit & integration tests
docker/              # Docker configuration
```

## Docker Deployment

```bash
docker-compose up -d
```

## Testing

```bash
npm test
```

## Security

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Helmet for security headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL/NoSQL injection prevention

## Performance

- ✅ MongoDB indexing
- ✅ Response compression
- ✅ Caching strategies
- ✅ Connection pooling
- ✅ Async operations

## Support

For issues or questions, refer to the API documentation or contact the development team.

## License

MIT

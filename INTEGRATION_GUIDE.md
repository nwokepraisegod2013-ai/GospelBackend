# Gospel Backend - API Integration Guide

This guide helps you integrate the Gospel Backend with the Flutter frontend application.

## Connection Setup

### 1. Configure Base URL

Update your Flutter app with the backend API base URL:

```dart
// In your Flutter app (e.g., services/app_state.dart)
const String API_BASE_URL = 'http://your-backend-url/api';
const String WS_URL = 'ws://your-backend-url';
```

### 2. HTTP Client Setup

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiClient {
  static const String baseUrl = 'http://localhost:3000/api';
  
  // Get method
  static Future<dynamic> get(String endpoint, {String? token}) async {
    try {
      final headers = {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      };
      
      final response = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
      );
      
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Failed to fetch: $e');
    }
  }
  
  // Post method
  static Future<dynamic> post(String endpoint, 
    {required dynamic body, String? token}) async {
    try {
      final headers = {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      };
      
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
        body: jsonEncode(body),
      );
      
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Failed to post: $e');
    }
  }
  
  static dynamic _handleResponse(http.Response response) {
    if (response.statusCode == 200 || response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error: ${response.statusCode}');
    }
  }
}
```

## API Integration Examples

### Authentication

```dart
// Register
final registerResponse = await ApiClient.post('/auth/register', 
  body: {
    'name': 'John Doe',
    'email': 'john@example.com',
    'password': 'password123',
  }
);
final token = registerResponse['token'];

// Login
final loginResponse = await ApiClient.post('/auth/login',
  body: {
    'email': 'john@example.com',
    'password': 'password123',
  }
);
```

### Content Management

```dart
// Fetch all content
final contentList = await ApiClient.get('/content?type=video&page=1&limit=20');

// Fetch single content
final content = await ApiClient.get('/content/content_id', token: token);

// Create content (Creator/Admin only)
final newContent = await ApiClient.post('/content',
  body: {
    'title': 'My Sermon',
    'type': 'video',
    'category': 'sermon',
    'thumbnailUrl': 'https://example.com/thumb.jpg',
    'contentUrl': 'https://example.com/video.mp4',
    'duration': 3600,
  },
  token: token,
);

// Like content
final likeResponse = await ApiClient.post('/content/content_id/like',
  token: token,
);
```

### Chat & Comments

```dart
// Get messages
final messages = await ApiClient.get(
  '/chat/content_id/messages?page=1&limit=50'
);

// Send message
final newMessage = await ApiClient.post(
  '/chat/content_id/messages',
  body: {'message': 'Great sermon!'},
  token: token,
);
```

## WebSocket Integration

```dart
import 'package:web_socket_channel/web_socket_channel.dart';

class ChatService {
  late WebSocketChannel channel;
  
  void connectToChat(String contentId) {
    channel = WebSocketChannel.connect(
      Uri.parse('ws://localhost:3000'),
    );
    
    // Join content room
    channel.sink.add(jsonEncode({
      'event': 'join-content',
      'data': {
        'contentId': contentId,
        'userId': userId,
      }
    }));
  }
  
  void sendMessage(String message) {
    channel.sink.add(jsonEncode({
      'event': 'new-message',
      'data': {'message': message}
    }));
  }
  
  Stream get messages => channel.stream;
  
  void disconnect() {
    channel.sink.close();
  }
}
```

## Data Models Mapping

### ContentItem (Flutter) ↔ Content (Backend)

```
Flutter                  Backend
├── id              ↔    _id
├── title           ↔    title
├── subtitle        ↔    subtitle
├── type            ↔    type (video|music|book|live)
├── thumbnailUrl    ↔    thumbnailUrl
├── author          ↔    author (User)
├── likes           ↔    likes
├── views           ↔    views
├── isLive          ↔    isLive
├── duration        ↔    duration
└── createdAt           createdAt
```

### ChatMessage Mapping

```
Flutter                  Backend
├── id              ↔    _id
├── author          ↔    author (User)
├── message         ↔    message
└── timestamp       ↔    createdAt
```

## Error Handling

```dart
try {
  final response = await ApiClient.get('/content');
} on Exception catch (e) {
  // Handle error
  print('Error: ${e.toString()}');
  
  // Show user-friendly message
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('Failed to load content')),
  );
}
```

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Store token in secure storage (e.g., flutter_secure_storage)
4. Include token in Authorization header for protected endpoints
5. Handle token expiry and refresh

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  static const storage = FlutterSecureStorage();
  
  Future<void> saveToken(String token) async {
    await storage.write(key: 'jwt_token', value: token);
  }
  
  Future<String?> getToken() async {
    return await storage.read(key: 'jwt_token');
  }
  
  Future<void> clearToken() async {
    await storage.delete(key: 'jwt_token');
  }
}
```

## Production Deployment

### Update Base URLs

```dart
const String API_BASE_URL = 'https://api.gospel-platform.com/api';
const String WS_URL = 'wss://api.gospel-platform.com';
```

### Security Headers

The backend automatically includes:
- CORS headers
- Security headers via Helmet
- Rate limiting (100 requests per 15 minutes)
- HTTPS support

### SSL/TLS

Ensure HTTPS is enabled in production:
- Use valid SSL certificate
- Redirect HTTP to HTTPS
- Enable HSTS headers

## Troubleshooting

### 404 Not Found
- Check API endpoint spelling
- Verify backend is running
- Check route definitions in backend

### 401 Unauthorized
- Token not provided
- Token expired
- Invalid token format

### 503 Service Unavailable
- Backend is down
- MongoDB is not running
- Check server logs

## Testing Endpoints

Use Postman or curl:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Get content
curl -X GET http://localhost:3000/api/content \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Support

For integration issues:
1. Check backend logs: `logs/error.log`
2. Verify MongoDB is running
3. Ensure CORS is properly configured
4. Check Flutter app logs

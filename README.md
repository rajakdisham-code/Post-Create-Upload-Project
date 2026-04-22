# Post-Create-Upload-Project

## Full Stack Authentication & CRUD API Project

A scalable backend API with JWT authentication, role-based access control, and a responsive React frontend. Built with Node.js/Express, MongoDB, and React.

## Features

### Backend
✅ User Registration & Login with JWT Authentication
✅ Password Hashing with bcrypt
✅ Role-Based Access Control (User/Admin)
✅ CRUD Operations for Posts
✅ Protected Routes with Middleware
✅ Comprehensive Error Handling
✅ Input Validation
✅ API Versioning (v1)

### Frontend
✅ Authentication Pages (Login/Register)
✅ Protected Dashboard
✅ Post Management with CRUD
✅ Role-Based UI
✅ Error & Success Messages
✅ Responsive Design

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcrypt

**Frontend:**
- React 19
- React Router v7
- Axios
- Vite

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (already present, update if needed):
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345678
NODE_ENV=development
PORT=3000
```

4. Start backend server:
```bash
npm start
```
or for development with auto-reload:
```bash
npm install -g nodemon
nodemon server.js
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```
POST /v1/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "email": "john@example.com",
    "username": "john_doe",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

#### Login User
```
POST /v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "email": "john@example.com",
    "username": "john_doe",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

#### Get Current User
```
GET /v1/auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": {
    "_id": "user_id",
    "email": "john@example.com",
    "username": "john_doe",
    "role": "user"
  }
}
```

### Post Endpoints

#### Create Post (Protected)
```
POST /v1/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My First Post",
  "description": "This is the post description",
  "caption": "Optional caption"
}

Response (201):
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "_id": "post_id",
    "title": "My First Post",
    "description": "This is the post description",
    "caption": "Optional caption",
    "userId": "user_id",
    "createdBy": "john@example.com",
    "createdAt": "2024-04-21T10:00:00.000Z",
    "updatedAt": "2024-04-21T10:00:00.000Z"
  }
}
```

#### Get All Posts
```
GET /v1/posts

Response (200):
{
  "success": true,
  "message": "Posts fetched successfully",
  "posts": [...]
}
```

#### Get Single Post
```
GET /v1/posts/{postId}

Response (200):
{
  "success": true,
  "post": {...}
}
```

#### Update Post (Only Post Owner or Admin)
```
PUT /v1/posts/{postId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "caption": "Updated caption"
}

Response (200):
{
  "success": true,
  "message": "Post updated successfully",
  "post": {...}
}
```

#### Delete Post (Only Post Owner or Admin)
```
DELETE /v1/posts/{postId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Post deleted successfully"
}
```

#### Get Current User's Posts
```
GET /v1/my-posts
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "User posts fetched successfully",
  "posts": [...]
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Title and description are required"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided. Unauthorized access."
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to update this post"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Post not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Usage

### User Flow

1. **Register/Login**
   - Navigate to login page
   - Create new account or login with existing credentials
   - Receive JWT token automatically

2. **Dashboard**
   - View welcome message and user role
   - See role-based access info
   - Navigate to post management

3. **Manage Posts**
   - Create new posts with title and description
   - View all posts in the feed
   - Edit your own posts
   - Delete your own posts
   - Admins can delete any post

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  username: String (required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date (default: now)
}
```

### Post Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  caption: String (optional),
  image: String (optional),
  userId: ObjectId (ref: User, required),
  createdBy: String (email),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

## Security Practices

- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens with 7-day expiration
- ✅ Protected routes with middleware
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ CORS enabled for frontend access
- ✅ Error messages don't expose sensitive info

## Scalability Considerations

1. **Database Indexing**: Indexes on frequently queried fields (email, userId)
2. **Caching**: Implement Redis for frequently accessed posts
3. **Load Balancing**: Use Nginx for distributing requests
4. **API Rate Limiting**: Add rate limiting middleware to prevent abuse
5. **Pagination**: Add pagination to post endpoints for large datasets
6. **Logging**: Implement Winston/Morgan for centralized logging
7. **Docker**: Containerize application for easy deployment
8. **Microservices**: Separate auth, post, and user services if needed
9. **CDN**: Use CDN for static assets
10. **Database Replication**: Set up MongoDB replica sets for high availability

## Deployment

### Backend (Heroku/Railway)
```bash
# Set environment variables on hosting platform
# Push code to repository
# Deployment happens automatically
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running and URI is correct
- Check that ports 3000 (backend) and 5173 (frontend) are not in use
- Verify network connectivity

### Token Issues
- Token stored in localStorage
- Check browser console for token presence
- Ensure token is sent with Authorization header

### CORS Issues
- Frontend and backend must have matching CORS configuration
- Update CORS settings if deploying on different domains

## Testing

### Test Login
1. Register a new account
2. Login with credentials
3. Should receive token and be redirected to dashboard

### Test CRUD
1. From dashboard, navigate to posts
2. Create a new post
3. Verify post appears in feed
4. Edit the post
5. Delete the post

### Test Authorization
1. Login as regular user
2. Try to delete another user's post
3. Should receive 403 Forbidden error

## Future Enhancements

- [ ] Social features (likes, comments, follow)
- [ ] File upload for images
- [ ] Search and filtering
- [ ] Real-time notifications with WebSocket
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Admin dashboard for user management
- [ ] Analytics and reporting

## Support

For issues and questions, please open a GitHub issue.

## License

ISC

---

**Made with ❤️ for the Primetrade.ai Intern Program**

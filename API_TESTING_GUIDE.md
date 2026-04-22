# API Testing Guide

Quick reference for testing the API using curl, Postman, or Insomnia.

## 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 3. Get Current User (Protected)

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 4. Create a Post (Protected)

```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "description": "This is a great post",
    "caption": "Check this out"
  }'
```

---

## 5. Get All Posts

```bash
curl -X GET http://localhost:3000/api/v1/posts
```

---

## 6. Update a Post (Protected - Only Owner/Admin)

```bash
curl -X PUT http://localhost:3000/api/v1/posts/POST_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description",
    "caption": "Updated caption"
  }'
```

---

## 7. Delete a Post (Protected - Only Owner/Admin)

```bash
curl -X DELETE http://localhost:3000/api/v1/posts/POST_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 8. Get My Posts (Protected)

```bash
curl -X GET http://localhost:3000/api/v1/my-posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Using Postman

1. **Create a new collection** called "Project API"
2. **Create environment variable** called `token` with an empty value
3. For login request, add a **Test** that saves the token:
   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```
4. **Use `{{token}}`** in the Authorization header for protected requests

---

## Testing Checklist

- [ ] Register a new user
- [ ] Login with credentials
- [ ] Create a post
- [ ] Get all posts
- [ ] Get my posts
- [ ] Update own post (should succeed)
- [ ] Try to update another user's post (should fail with 403)
- [ ] Delete own post (should succeed)
- [ ] Try to delete another user's post (should fail with 403)
- [ ] Test with invalid token (should fail with 401)

---

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `No token provided` | Missing Authorization header | Add `Authorization: Bearer {token}` |
| `Invalid or expired token` | Token is invalid/expired | Get a new token by logging in |
| `Permission denied` | Not the post owner/admin | Use a different user or admin account |
| `CORS error` | Frontend and backend mismatch | Check CORS settings in app.js |
| `MongoDB connection error` | Database not running | Start MongoDB service |
| `Port 3000 already in use` | Another process using port | Kill process or use different port |

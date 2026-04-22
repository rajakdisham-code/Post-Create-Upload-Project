# ⚡ Quick Start Guide

Get the full-stack application running in 5 minutes!

## Prerequisites Check
```bash
# Check Node.js
node --version  # Should be v14 or higher

# Check npm
npm --version   # Should be v6 or higher

# Check MongoDB is running
mongod --version
```

---

## 🚀 Start Backend (Terminal 1)

```bash
# Navigate to backend
cd backend

# Install dependencies (one time)
npm install

# Start development server
npm run dev
```

**Expected output:**
```
connected to DB
Server is running on port 3000
```

---

## 🎨 Start Frontend (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (one time)
npm install

# Start dev server
npm run dev
```

**Expected output:**
```
  VITE v8.0.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🔗 Access the App

Open your browser and go to:
```
http://localhost:5173
```

---

## 📝 First-Time Setup

### 1. Register a User
- Click "Register" link
- Fill in: Username, Email, Password
- Click "Register"
- Auto-redirected to Dashboard

### 2. Create a Post
- Click "Manage Posts" button
- Click "Create Post"
- Fill in: Title, Description, Caption
- Click "Create Post"

### 3. View Posts
- See your post in the feed
- Click "Edit" to modify
- Click "Delete" to remove

---

## 🧪 Test API Directly

### Option 1: Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Option 2: Using Postman

1. Import `Postman_Collection.json`
2. Register a user
3. Copy the `token` from response
4. In Postman, set `token` variable: `Tests` tab → `pm.environment.set("token", pm.response.json().token);`
5. Use `{{token}}` in Authorization header for protected endpoints

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Start MongoDB (Windows)
mongod

# Or use MongoDB Atlas
# Update .env with your cloud URI
```

### "Port 3000 already in use"
```bash
# Kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### "Port 5173 already in use"
```bash
# Vite will auto-increment, check console for actual port
```

### "Module not found" error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "JWT_SECRET not found"
```bash
# Check .env file exists in backend folder
cat backend/.env

# Should contain:
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345678
```

---

## 📚 Key Features to Test

- ✅ Register new user
- ✅ Login with credentials
- ✅ Create a post
- ✅ Edit post
- ✅ Delete post
- ✅ View all posts
- ✅ Logout
- ✅ Try to access dashboard without login (redirect)

---

## 📖 Documentation

- **API Docs**: See `README.md`
- **API Testing**: See `API_TESTING_GUIDE.md`
- **Deployment**: See `DEPLOYMENT_GUIDE.md`
- **Project Details**: See `PROJECT_SUMMARY.md`

---

## 🔗 Project URLs

| Service | URL | Port |
|---------|-----|------|
| Backend API | http://localhost:3000/api | 3000 |
| Frontend | http://localhost:5173 | 5173 |
| MongoDB | mongodb://localhost:27017 | 27017 |

---

## 📱 API Quick Reference

### No Authentication Needed
```
GET  /api/v1/posts
GET  /api/v1/posts/:id
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### With JWT Token Required (Header: `Authorization: Bearer {token}`)
```
GET    /api/v1/auth/me
POST   /api/v1/posts
GET    /api/v1/my-posts
PUT    /api/v1/posts/:id
DELETE /api/v1/posts/:id
```

---

## ✅ Success Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can create a post
- [ ] Dashboard shows user info
- [ ] Can view all posts
- [ ] Can edit own post
- [ ] Can delete own post
- [ ] Logout works

---

## 🎓 Learning Resources

- JWT Authentication: https://jwt.io
- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- React: https://react.dev
- Axios: https://axios-http.com

---

## 💬 Need Help?

1. Check the troubleshooting section above
2. Review `README.md` for detailed setup
3. Check browser console for errors (F12)
4. Check terminal output for backend errors
5. Ensure MongoDB is running
6. Verify all environment variables are set

---

**Ready? Start the servers and navigate to http://localhost:5173 to get started!** 🚀

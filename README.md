# Post-Create-Upload-Project

Full-stack application with JWT authentication and post CRUD features.

## Project Structure

- backend: Node.js, Express, MongoDB, JWT auth APIs
- frontend: React + Vite client app

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Frontend: React, React Router, Axios, Vite

## Quick Start

### 1) Clone

```bash
git clone https://github.com/rajakdisham-code/Post-Create-Upload-Project.git
cd Post-Create-Upload-Project
```

### 2) Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=<your_jwt_secret>
PORT=3000
NODE_ENV=development
```

Run backend:

```bash
npm start
```

### 3) Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## API Base URL

```text
http://localhost:3000/api
```

## Main Features

- User registration and login
- JWT-based protected routes
- Create, read, update, delete posts
- Role-based access checks

## Security Notes

- Do not commit `.env` files
- Rotate secrets immediately if leaked
- Use strong, unique database credentials

## License

ISC

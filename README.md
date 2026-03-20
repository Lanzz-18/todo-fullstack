# todo-fullstack
A full-stack Todo application with a React frontend and a Node.js/Express REST API backed by MongoDB. Features JWT authentication with refresh token rotation, protected routes, and a clean component-based UI.

# Features

- JWT authentication with access + refresh token rotation
- Refresh token stored in httpOnly cookie (XSS-safe)
- Protected API routes — only authenticated users can manage their todos
- Full CRUD — create, read, update, and delete todos
- Mark todos as complete or incomplete
- Centralized error handling middleware
- Responsive UI built with React

# Tech Stack
- Frontend -> React 18, Axios
- Backend -> Node.js, Express.js
- Database -> MongoDB, Mongoose
- Auth -> JSON Web Tokens, bcryptjs
- Security -> helmet.js, express-rate-limit, cookie-parser
- Dev tools -> nodemon, dotenv

# Architecture
todo-fullstack/
├── todo-backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # register, login, refresh, logout
│   │   └── todoController.js   # CRUD handlers
│   ├── middleware/
│   │   ├── auth.js             # JWT verify middleware (protect)
│   │   └── errorHandler.js     # centralized error handler
│   ├── models/
│   │   ├── User.js             # Mongoose user schema (bcrypt)
│   │   ├── RefreshToken.js     # hashed refresh tokens + TTL index
│   │   └── Todo.js             # Mongoose todo schema
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   └── todos.js            # /api/todos/*  (protected)
│   ├── .env.example
│   └── server.js
│
└── todo-frontend/
    └── todo-frontend/
        ├── src/
        │   ├── api.js          # Axios instance + auto-refresh interceptor
        │   ├── components/     # TodoItem, TodoForm, Navbar, etc
        │   └── pages/          # Login, Register, Dashboard
        └── package.json

# Quick Start
**Prerequisites**
- Node.js v20+
- MongoDB — local or free Atlas cluster
- npm v9+


**1. Clone the repo**
bashgit clone https://github.com/Lanzz-18/todo-fullstack.git
cd todo-fullstack
**2. Set up the backend**
bashcd todo-backend
npm install
cp .env.example .env
Fill in your .env:
envPORT=3000
MONGO_URI=mongodb://localhost:/todo-app
CLIENT_URL=http://localhost:

**Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"**
JWT_ACCESS_SECRET=your_64_char_random_string
JWT_REFRESH_SECRET=your_different_64_char_random_string

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

NODE_ENV=development
Start the backend:
bashnpm run dev     # nodemon — auto-restarts on file changes
`Server runs at http://localhost:`

**3. Set up the frontend**
bashcd ../todo-frontend/todo-frontend
npm install
npm run dev
`App runs at http://localhost:`

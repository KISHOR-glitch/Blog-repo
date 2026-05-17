# Mini Blog Website - Complete Setup Guide

A full-stack blog website built with **HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB**.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Docker Setup](#docker-setup)
- [Jenkins CI/CD Setup](#jenkins-cicd-setup)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### User Features
- ✅ User registration and login
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Responsive design
- ✅ Real-time blog search

### Blog Features
- ✅ Create blog posts
- ✅ Edit own blogs
- ✅ Delete own blogs
- ✅ View all blogs
- ✅ View single blog details
- ✅ Blog statistics (views, comments count)

### Comment Features
- ✅ Add comments to blogs
- ✅ Delete own comments
- ✅ View all comments on a blog

### Pages
- 🏠 Home page - Display all blogs
- 📝 Create Blog page - Create new blog post
- ✏️ Edit Blog page - Edit existing blog
- 📖 Blog Details page - Read full blog with comments
- 📊 Dashboard page - Manage your blogs
- 🔐 Login page - User authentication
- ✍️ Register page - Create new account

## 📁 Project Structure

```
blog-site/
├── public/                    # Frontend files (served by Express)
│   ├── index.html            # Home page
│   ├── login.html            # Login page
│   ├── register.html         # Register page
│   ├── create-blog.html      # Create blog page
│   ├── edit-blog.html        # Edit blog page
│   ├── blog-details.html     # Blog details page
│   ├── dashboard.html        # User dashboard
│   ├── css/
│   │   └── style.css         # All CSS styles
│   └── js/
│       ├── common.js         # Common utilities
│       ├── auth.js           # Authentication logic
│       ├── blog.js           # Blog operations
│       └── dashboard.js      # Dashboard logic
│
├── server/                    # Backend files
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Blog.js           # Blog schema
│   │   └── Comment.js        # Comment schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── blog.js           # Blog routes
│   │   └── comment.js        # Comment routes
│   ├── controllers/
│   │   ├── authController.js # Auth logic
│   │   ├── blogController.js # Blog logic
│   │   └── commentController.js # Comment logic
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   └── app.js                # Express app setup
│
├── package.json              # Project dependencies
├── .env                      # Environment variables (IMPORTANT: Don't commit)
├── .env.example              # Example environment file
├── .gitignore                # Files to ignore in git
├── Dockerfile                # Docker configuration
├── Jenkinsfile               # CI/CD pipeline
└── README.md                 # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **MongoDB** (v4.4 or higher)
   - **Option 1: Local Installation**
     - Windows: Download from https://www.mongodb.com/try/download/community
     - macOS: `brew install mongodb-community`
     - Linux: Follow MongoDB documentation
   
   - **Option 2: MongoDB Atlas (Cloud)**
     - Create account at https://www.mongodb.com/cloud/atlas
     - Create free cluster
     - Get connection string from Atlas dashboard

4. **Git** (for version control)
   - Download from: https://git-scm.com/

5. **Docker** (optional, for containerization)
   - Download from: https://www.docker.com/

6. **Jenkins** (optional, for CI/CD)
   - Download from: https://www.jenkins.io/

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd blog-site

# Or manually download and extract the ZIP file
```

### Step 2: Install Dependencies

```bash
# Install all npm packages from package.json
npm install
```

### Step 3: Set Up Environment Variables

```bash
# Copy example .env file
cp .env.example .env

# Edit .env file with your configuration
# IMPORTANT: Change JWT_SECRET to a random string in production
```

**Example .env file:**
```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/blog-site

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_to_something_random_and_long

# API URL (for frontend)
API_URL=http://localhost:5000
```

### Step 4: Start MongoDB

**Option 1: Local MongoDB**
```bash
# Windows (if installed as service)
# MongoDB starts automatically

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option 2: MongoDB Atlas (Cloud)**
- Create cluster in Atlas
- Get connection string
- Replace MONGODB_URI in .env with your Atlas connection string

### Step 5: Run the Application

```bash
# Development mode (with auto-reload using nodemon)
npm run dev

# Production mode
npm start
```

**Output should show:**
```
Server running on http://localhost:5000
API Health check: http://localhost:5000/api/health
MongoDB connected successfully
```

## 🌐 Accessing the Application

Once the server is running:

1. **Open your browser and navigate to:**
   - http://localhost:5000

2. **Available Pages:**
   - Home: http://localhost:5000/ (or /index.html)
   - Register: http://localhost:5000/register.html
   - Login: http://localhost:5000/login.html
   - Dashboard: http://localhost:5000/dashboard.html (requires login)
   - Create Blog: http://localhost:5000/create-blog.html (requires login)

## 🔌 API Endpoints

### Authentication Endpoints

```
POST /api/auth/register
- Register new user
- Body: { username, email, password, confirmPassword }

POST /api/auth/login
- Login user
- Body: { email, password }

GET /api/auth/me
- Get current user info
- Headers: Authorization: Bearer <token>
```

### Blog Endpoints

```
GET /api/blogs
- Get all blogs (public)

GET /api/blogs/:id
- Get single blog by ID (public)

GET /api/blogs/user/my-blogs
- Get user's blogs (protected)
- Headers: Authorization: Bearer <token>

POST /api/blogs
- Create new blog (protected)
- Headers: Authorization: Bearer <token>
- Body: { title, description, content }

PUT /api/blogs/:id
- Update blog (protected)
- Headers: Authorization: Bearer <token>
- Body: { title, description, content }

DELETE /api/blogs/:id
- Delete blog (protected)
- Headers: Authorization: Bearer <token>
```

### Comment Endpoints

```
POST /api/comments/:blogId
- Add comment to blog (protected)
- Headers: Authorization: Bearer <token>
- Body: { text }

DELETE /api/comments/:commentId
- Delete comment (protected)
- Headers: Authorization: Bearer <token>
```

## 🐳 Docker Setup

### Build Docker Image

```bash
# Build Docker image
docker build -t mini-blog-site:latest .
```

### Run Docker Container

```bash
# Run container with MongoDB connection
docker run -d \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/blog-site \
  -e JWT_SECRET=your_secret_key \
  --name mini-blog \
  mini-blog-site:latest
```

### Docker Compose (Optional)

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/blog-site
      - JWT_SECRET=your_secret_key
    depends_on:
      - mongo
  
  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Run with: `docker-compose up`

## 🔄 Jenkins CI/CD Setup

### Prerequisites
- Jenkins installed and running
- Docker installed on Jenkins agent
- Git configured

### Setup Steps

1. **Create New Pipeline Job:**
   - Jenkins Dashboard → New Item
   - Enter job name → Select "Pipeline"
   - Click OK

2. **Configure Pipeline:**
   - Under Pipeline section, select "Pipeline script from SCM"
   - Choose Git as SCM
   - Enter repository URL
   - Select branch (main or develop)

3. **Pipeline Stages:**
   - **Install Dependencies**: Runs `npm install`
   - **Build Docker Image**: Creates Docker image
   - **Run Application**: Tests application
   - **Push to Registry**: Pushes image to Docker registry (optional)

4. **Run Pipeline:**
   - Click "Build Now"
   - Monitor progress in build logs

## 📝 Sample API Usage

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Create Blog

```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Blog",
    "description": "This is my first blog post",
    "content": "This is the full content of my blog..."
  }'
```

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Start MongoDB service
2. Check MongoDB is running: `mongo --version`
3. Use MongoDB Atlas connection string if local MongoDB isn't running
4. Check MONGODB_URI in .env file

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE :::5000`

**Solutions:**
1. Change PORT in .env file
2. Kill process using port: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)
3. Or use different port: `PORT=3000 npm start`

### JWT Token Expired

**Problem:** `Invalid or expired token`

**Solutions:**
1. Login again to get new token
2. Token expires in 7 days by default
3. Clear localStorage and refresh browser

### CORS Error

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Ensure API_URL in .env matches frontend URL
2. CORS is enabled in server/app.js
3. Check frontend is using correct API endpoint

## 📚 Beginner Tips

1. **First Time Setup:**
   - Follow steps 1-5 under "Installation & Setup"
   - Start with local MongoDB
   - Run in development mode: `npm run dev`

2. **Creating Your First Blog:**
   - Register at http://localhost:5000/register.html
   - Login at http://localhost:5000/login.html
   - Click "Create Blog" in navbar
   - Fill in title, description, and content
   - Click "Create Blog" button

3. **Debugging:**
   - Check browser console for JavaScript errors: Press F12
   - Check server logs in terminal for backend errors
   - Use `console.log()` to debug frontend code

4. **Code Comments:**
   - All code files include comments explaining functionality
   - Perfect for learning how the application works

## 🔒 Security Notes

⚠️ **Important for Production:**

1. **Change JWT_SECRET:**
   ```
   JWT_SECRET=generate_a_random_long_string_here
   ```

2. **Use HTTPS:**
   - In production, use HTTPS instead of HTTP
   - Get SSL certificate from Let's Encrypt

3. **Environment Variables:**
   - Never commit .env file to git
   - Use .gitignore to exclude .env

4. **Database Security:**
   - Use MongoDB Atlas with IP whitelist
   - Enable database authentication
   - Regular backups

5. **Input Validation:**
   - All inputs are validated on backend
   - Never trust frontend validation alone

## 📖 Learning Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [MDN Web Docs](https://developer.mozilla.org/)

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Author

Created as a complete full-stack web development project for beginners.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Questions or Issues?**

- Check the [Troubleshooting](#troubleshooting) section
- Review code comments in the files
- Ensure all prerequisites are installed
- Check server logs for error messages

Happy coding! 🚀

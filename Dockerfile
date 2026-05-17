# Use official Node.js runtime as base image
# This image includes Node.js and npm pre-installed
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
# This layer is cached if dependencies don't change
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Expose the port that the application runs on
# This doesn't actually publish the port, but documents which port to expose
EXPOSE 5000

# Set default environment variables (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=5000
ENV MONGODB_URI=mongodb+srv://kishorarjun383_db_user:1OYVXz5Il8d9aBvZ@blog-site.i5jydse.mongodb.net/?appName=blog-site
ENV JWT_SECRET=mini_blog_jwt_secret_key_2026_secure_token_random_string_here

# Health check - Docker will periodically check if the app is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Command to run the application
CMD ["npm", "start"]

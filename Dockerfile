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

# Set environment to production
ENV NODE_ENV=production

# Health check - Docker will periodically check if the app is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Command to run the application
CMD ["npm", "start"]

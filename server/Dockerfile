# Dockerfile for Server (optional - for Docker deployment)
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "src/server.js"]

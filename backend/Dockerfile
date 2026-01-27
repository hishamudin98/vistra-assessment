# Build stage
FROM node:22-alpine AS builder

# Build argument for app name (auth or core)
ARG APP_NAME=core

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

# Build argument for app name
ARG APP_NAME=core

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Create upload directory
RUN mkdir -p public/upload && chmod 755 public/upload

# Expose port (will be overridden by docker-compose)
EXPOSE 1010 1011

# Start the application based on APP_NAME
CMD node dist/apps/${APP_NAME}/main.js

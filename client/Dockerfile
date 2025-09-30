# OpenSupports Client Dockerfile
# Multi-stage build for optimized production image

# Build stage
FROM --platform=linux/amd64 node:16.20-alpine as builder

# Set working directory
WORKDIR /app

# Add package files for better layer caching
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --silent && npm cache clean --force

# Copy source code
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

# Rebuild native dependencies for alpine
RUN npm rebuild node-sass --silent

# Build the application
RUN npm run build

# Production stage
FROM --platform=linux/amd64 nginx:alpine

# Install curl for health checks and remove cache
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx run directory and set permissions
RUN mkdir -p /var/run/nginx /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/run/nginx /var/cache/nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chmod -R 777 /var/cache/nginx /var/run/nginx

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Switch to non-root user
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

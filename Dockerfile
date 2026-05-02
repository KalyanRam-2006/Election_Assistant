# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy the rest of the frontend source code
COPY frontend/ ./

# Build the production bundle
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built React app to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Cloud Run sets the PORT env variable (default 8080)
ENV PORT=8080
EXPOSE 8080

# nginx docker image auto-substitutes env vars in templates and starts nginx
CMD ["nginx", "-g", "daemon off;"]

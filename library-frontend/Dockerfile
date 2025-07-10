# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:stable-alpine
# Copy the built React app to Nginx's web root
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Custom Nginx configuration to proxy API requests to backend services
# This is crucial for local development or if not using Kubernetes Ingress rules for API routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
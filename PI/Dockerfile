# Pull NGINX image
FROM nginx:latest

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the static files scr
COPY src /usr/share/nginx/html

# Expose port 80
EXPOSE 80
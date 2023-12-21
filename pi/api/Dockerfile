# Use Node LTS as the base image for development
FROM node:lts AS development

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dev dependencies
RUN npm Install

# Use Node LTS as the base image for production
FROM node:lts AS production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Use Node Alpine as the final image
FROM node:alpine

WORKDIR /usr/src/app

# Copy the built files from the production image
COPY . .

# Copy packges from the production image
COPY --from=production /node_modules ./node_modules

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

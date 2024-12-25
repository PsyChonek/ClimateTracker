# Use Node LTS as the base image for building
FROM node:lts AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY . .

# Build the Nuxt application
RUN npm run build

# Use Node Alpine for the final image
FROM node:alpine AS production

# Install minimal dependencies for runtime
RUN apk add --no-cache bash

# Set the working directory
WORKDIR /usr/src/app

# Copy built files and node_modules from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.output ./.output

# Expose the Nuxt application port
EXPOSE 3000

# Start the Nuxt application
CMD ["node", ".output/server/index.mjs"]
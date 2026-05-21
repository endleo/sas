# Use the Node v24 LTS image as requested for compatibility
FROM node:24-alpine

WORKDIR /app

# Copy dependency files first to leverage Docker's layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies required by Svelte)
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose SvelteKit's default development port
EXPOSE 5173

# We offload the runtime command execution to docker-compose 
# to allow for proper database sequencing.
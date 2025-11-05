# Use Node.js LTS image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server files
COPY . .

# Expose the server port
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]
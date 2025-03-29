# Use lightweight Node.js Alpine image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /dis

# Copy package.json and package-lock.json first (for caching)
COPY package.json package-lock.json ./

# Install backend dependencies inside the container
RUN npm install

# Copy the entire project into the container
COPY . .

# Navigate to frontend and install frontend dependencies
WORKDIR /dis/frontend
RUN npm install

# Set working directory back to root
WORKDIR /dis

# Expose necessary ports
EXPOSE 5000
EXPOSE 3000

# Start both frontend and backend
CMD ["npm", "run", "dev"]

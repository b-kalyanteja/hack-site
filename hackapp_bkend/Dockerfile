# Use the official Node.js image as a base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies from package.json file
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3001
EXPOSE 3001

# Command to run the application
CMD ["node", "your_app_file.js"]

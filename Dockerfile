# Step 1: Use official Node.js image as the build environment
FROM node:18 AS build

# Step 2: Set the working directory inside the container
WORKDIR /

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Build the React application
RUN npm start

# Step 7: Use an official Nginx image to serve the built React app
FROM nginx:alpine

# Step 8: Copy the build folder to the Nginx HTML directory
COPY --from=build /build /usr/share/nginx/html

# Step 9: Expose port 80 to access the application
EXPOSE 80

# Step 10: Start Nginx server (it runs by default)
CMD ["nginx", "-g", "daemon off;"]

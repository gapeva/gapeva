# Stage 1: Build the React App
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the built files from Stage 1 to Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config (optional, ensures React Router works)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

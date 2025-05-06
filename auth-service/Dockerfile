# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8003
CMD ["npm", "run", "dev"]

# TODO: Production stage

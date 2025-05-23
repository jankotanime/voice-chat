# build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# produkcja
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN npm install --omit=dev
EXPOSE 8001
CMD ["node", "src/server.js"]

# dev: CMD ["npm", "run", "dev"]

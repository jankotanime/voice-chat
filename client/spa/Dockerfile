# Etap 1: build aplikacji
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Etap 2: uruchomienie aplikacji
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./
RUN npm install --omit=dev  # Instalacja tylko zależności produkcyjnych

EXPOSE 3000
CMD ["npm", "run", "dev"]

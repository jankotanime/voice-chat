# Etap 1: build aplikacji
FROM node:18-alpine AS builder

ARG NEXT_PUBLIC_KEYCLOAK_URL
ENV NEXT_PUBLIC_KEYCLOAK_URL=$NEXT_PUBLIC_KEYCLOAK_URL

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Etap 2: uruchomienie aplikacji
FROM node:18-alpine AS runner

ARG NEXT_PUBLIC_KEYCLOAK_URL
ENV NEXT_PUBLIC_KEYCLOAK_URL=$NEXT_PUBLIC_KEYCLOAK_URL

WORKDIR /app
COPY --from=builder /app ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "run", "dev"]

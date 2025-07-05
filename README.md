# Voice chat
### Version: 1.1 (DEV)

---

**Voice chat** is a communication server inspired by Discord, created as part of projects for University Of Gdańsk courses. The application enables real-time communication using websockets and integrates with Keycloak for user management. [Go to preview](#preview)

> **Note!** This is a purely development application — all  
> variables are public and under no circumstances  
> should it be used in production.

## Środowisko uruchomieniowe

### Wymagania:
- Docker + Docker Compose
- Kubernetes (kubectl)
- Node.js

## Launch instructions

### 1. Building and running with Docker:
1. Edit the variables in the `.env` file to match your environment (e.g., IP) and set the ports to avoid conflicts with other applications.
2. Build and run the containers:  
   `docker-compose up`

### 2. Running on Kubernetes:
1. Add the following line to `/etc/hosts` (administrator required): `127.0.0.1 voice-chat.pl`
2. Run the `k8s_run.sh` script.
3. Wait for the application to start — this may take up to about 5 minutes.
> **Note!** Kubernetes does not have a working SSR client.

### 3. Login credentials:
1. Administrator account  
- login: `sigma`  
- password: `sigma`  

2. User account  
- login: `test`  
- password: `test`

## Features

- **SPA (Next.js)** — User interface with role-based views to simplify usage.
- **SSR (Express with EJS)** — Admin panel for reviewing information about rooms and users (Docker only).
- **Backend2Backend** — Connection between websocket server and authorization API.
- **Websockets** — Multi-channel real-time communication.
- **Audio transmission** — Captures audio from the browser's microphone and sends it to users in the room.
- **Keycloak integration** — Secure user, role, client, and authorization management in a centralized way.
- **Node.js backend** — Application server logic.
- **MongoDB** — Database storing information about rooms and assigned roles.
- **Postgres** — Database used by Keycloak (for Kubernetes).
- **Docker and Kubernetes** — Infrastructure enabling easy deployment and maintenance of the application.
- **Ingress** — Launching the app and servers under a shared domain.
- **Volumes** — Persistent data storage.
- **TLS certificates** — Ensures encrypted communication.
- **Access control** — Management of user permissions and room access.
- **Secrets in Docker and Kubernetes** — Secure storage of sensitive data like tokens, keys, and passwords.
- **HPA** — Automatic scaling of pod replicas depending on load.
- **Custom images** — Images created specifically for the app’s components.
- **PV and PVC** — Application data storage.

## Project structure

- **Frontend:** Next.js, React, Express, EJS, CSS  
- **Backend:** Node.js, HTTP, Express, WebSocket  
- **Databases:** MongoDB (rooms), PostgreSQL (Keycloak)  
- **Infrastructure:** Docker, Kubernetes, Keycloak, Bash (scripts)

## Preview

![voice-chat-1](https://github.com/user-attachments/assets/83df22d9-c429-4ac1-acb0-8b7ff36be5c6)
![voice-chat-2](https://github.com/user-attachments/assets/76919016-85c0-4be0-848b-2943fcd94cf4)
![voice-chat-3](https://github.com/user-attachments/assets/4c60beb9-4ba0-41ec-b0c2-3eff88e390c9)

---

## DockerHub repository 
https://hub.docker.com/u/jankotanimesigma

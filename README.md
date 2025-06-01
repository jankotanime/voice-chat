# Communication Server

---
## buildx docker https://hub.docker.com/u/jankotanimesigma

## kubernetes: kubectl apply -f k8s/ --recursive

do config map dla keycloak z realm
kubectl create configmap realm-export --from-file=realm-export.json=realm-export.json -n default
dla certs
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml

do cert własnych
kubectl create secret tls voice-chat-pl-tls \
  --cert=./k8s/tls.crt --key=./k8s/tls.key -n default

port forwarding keycloak
  kubectl port-forward deployment/keycloak 8080:8080

## Symulator serwera na platformie discord. Projekt na BAW i Technologie aplikacji Chmurowych.

Struktura projektu: Frontend: TypeScript z NextJS, Backend: ? , DB: MongoDB, Docker, Websockety
#!/bin/bash

set -euo pipefail

# Usuń namespace voice-chat jeśli istnieje
kubectl delete namespace voice-chat --ignore-not-found

echo "Czekam aż namespace voice-chat zostanie usunięty..."
while kubectl get namespace voice-chat &> /dev/null; do
  sleep 1
done

# Utwórz namespace na nowo
kubectl create namespace voice-chat

# Przełącz kontekst na namespace voice-chat
kubectl config set-context --current --namespace=voice-chat

# Zainstaluj ingress-nginx (jeśli jeszcze nie zainstalowany)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml

echo "Czekam na uruchomienie Ingress-NGINX..."
kubectl rollout status deployment ingress-nginx-controller -n ingress-nginx

# Tworzenie sekretów z katalogu ./secrets
SECRET_NAME="backend-secrets"
SECRETS_DIR="./secrets"

if [ ! -d "$SECRETS_DIR" ]; then
  echo "Folder $SECRETS_DIR nie istnieje."
  exit 1
fi

FROM_FILE_ARGS=()
for file in "$SECRETS_DIR"/*; do
  if [ -f "$file" ]; then
    FROM_FILE_ARGS+=(--from-file="$(basename "$file")=$file")
  fi
done

kubectl delete secret "$SECRET_NAME" --ignore-not-found
kubectl create secret generic "$SECRET_NAME" "${FROM_FILE_ARGS[@]}"

echo "=== Tworzenie PersistentVolume i PersistentVolumeClaim ==="
kubectl apply -f k8s/mongo/mongo-dump-pv.yaml
kubectl apply -f k8s/mongo/mongo-dump-pvc.yaml
kubectl apply -f k8s/keycloak/keycloak-pv.yaml
kubectl apply -f k8s/keycloak/keycloak-pvc.yaml
kubectl apply -f k8s/postgres/pv.yaml
kubectl apply -f k8s/postgres/pvc.yaml

echo "=== Tworzenie Postgresa ==="
kubectl apply -f k8s/postgres/service.yaml
kubectl apply -f k8s/postgres/deployment.yaml

echo "=== Tworzenie ConfigMapy z realmem ==="
kubectl delete configmap keycloak-realm --ignore-not-found
kubectl create configmap keycloak-realm --from-file=realm-export.json=realm-export.json

echo "=== Tworzenie ConfigMapy dla ingress ==="
kubectl delete configmap ingress-headers --ignore-not-found
kubectl apply -f k8s/ingress-headers.yaml

echo "=== Tworzenie Service i Deployment dla MongoDB ==="
kubectl apply -f k8s/mongo/mongo-service.yaml
kubectl apply -f k8s/mongo/mongo-deployment.yaml

echo "=== Tworzenie Service i Deployment dla Keycloak ==="
kubectl apply -f k8s/keycloak/keycloak-service.yaml
kubectl apply -f k8s/keycloak/keycloak-deployment.yaml

echo "=== Tworzenie Service i Deployment dla User Service ==="
kubectl apply -f k8s/user/user-service-deployment.yaml

echo "=== Tworzenie Service i Deployment dla Voice Service ==="
kubectl apply -f k8s/voice/voice-service-deployment.yaml

echo "=== Tworzenie Service i Deployment dla SSR ==="
kubectl apply -f k8s/ssr/ssr-deployment.yaml

echo "=== Tworzenie Service i Deployment dla SPA ==="
kubectl apply -f k8s/spa/spa-deployment.yaml

echo "=== Tworzenie HPA dla SPA ==="
kubectl apply -f k8s/spa/spa-hpa.yaml

echo "=== Tworzenie Ingress ==="
kubectl apply -f k8s/ingress.yaml

echo "Wszystkie zasoby zostały utworzone."


# Tworzenie sekretów

kubectl create secret generic backend-secrets \
  --from-literal=backend-id=backend \
  --from-literal=backend-realm=voice-chat \
  --from-literal=backend-secret=JFgMXm6AfDvIavABbpo4KnKoz5Eirjzk \
  -n voice-chat

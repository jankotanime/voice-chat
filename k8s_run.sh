#!/bin/bash

set -e

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

echo "=== Tworzenie ConfigMapy z realmem ==="
kubectl delete configmap keycloak-realm --ignore-not-found
kubectl create configmap keycloak-realm --from-file=realm-export.json=realm-export.json

echo "=== Tworzenie ConfigMapy dla ingress ==="
kubectl delete configmap ingress-headers  --ignore-not-found
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

wait
#!/bin/bash

set -euo pipefail

kubectl delete namespace voice-chat --ignore-not-found

echo "Czekam aż namespace voice-chat zostanie usunięty..."
while kubectl get namespace voice-chat &> /dev/null; do
  sleep 1
done

kubectl create namespace voice-chat

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml

echo "Czekam na uruchomienie Ingress-NGINX..."
kubectl rollout status deployment ingress-nginx-controller -n ingress-nginx

kubectl create configmap keycloak-realm --from-file=realm-export.json=realm-export.json -n voice-chat

kubectl apply -f k8s -R -n voice-chat
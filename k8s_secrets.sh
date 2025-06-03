#!/bin/bash

SECRET_NAME="backend-secrets"
SECRETS_DIR="./secrets"

if [ ! -d "$SECRETS_DIR" ]; then
  echo "Folder $SECRETS_DIR nie istnieje."
  exit 1
fi

FROM_FILE_ARGS=""
for file in "$SECRETS_DIR"/*; do
  if [ -f "$file" ]; then
    FROM_FILE_ARGS+="--from-file=$(basename "$file")=$file "
  fi
done

kubectl delete secret $SECRET_NAME --ignore-not-found
kubectl create secret generic $SECRET_NAME $FROM_FILE_ARGS

# Voice chat
### Wersja: 1.1

---

**Voice chat** to serwer komunikacyjny inspirowany platformą Discord, stworzony w ramach projektów na BAW oraz Technologie Aplikacji Chmurowych. Aplikacja umożliwia komunikację w czasie rzeczywistym z wykorzystaniem websocketów oraz integrację z systemem Keycloak do zarządzania użytkownikami.

## Środowisko uruchomieniowe

### Wymagania:
- Docker + Docker Compose
- Kubernetes (kubectl)
- Node.js

## Instrukcja uruchomienia

### 1. Budowanie i uruchamianie z Dockerem:
1. Zmień zmienne w pliku `.env`, aby były zgodne z Twoim środowiskiem (np. ip) oraz ustaw porty w taki sposób, aby nie kolidowały z innymi aplikacjami
2. Zbuduj i uruchom kontenery:  
   `docker-compose up --build`

### 2. Uruchomienie na Kubernetes:
1. Zmień porty w `deploy_k8s.sh` lub `ingress.yaml` zależnie od sposobu uruchamiania aplikacji  
2. W plikach `mongo-dump-pv.yaml` i `keycloak-pv.yaml` zmień `spec.hostPath.path` na swoją lokalizację folderów `keycloak-data` oraz `dump`
3. Uruchom skrypt `k8s_run.sh` (Tylko na linux!)
4. Jeżeli skrypt nie działa ustaw kubernetesa ręcznie (od punktu 5)
5. Uruchom pliki yaml:  
  `kubectl apply -f k8s/ -R`
6. Utwórz ConfigMap dla Keycloak z plikiem realm:  
  `kubectl create configmap realm-export --from-file=realm-export.json=realm-export.json -n default`
7. (dla ingress przy TLS) Zainstaluj cert-manager:  
  `kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml`
8. (dla ingress przy TLS) Jeżeli nie ma istniejącego certyfikatu dodaj własny TLS:  
  `kubectl create secret tls voice-chat-pl-tls --cert=./k8s/tls.crt --key=./k8s/tls.key -n default`
9. Przekieruj porty:  
  `kubectl port-forward deployment/{service} {wybrany port}:{wymagany port}`

## Funkcjonalności

- **Komunikacja w czasie rzeczywistym** – websockety.
- **Przesyłanie dźwięku w czasie rzeczywistym** – możliwość komunikacji głosowej między użytkownikami.
- **Logowanie i autoryzacja** – integracja z Keycloak zapewniająca bezpieczne zarządzanie dostępem.
- **Integracja z Keycloak** – bezpieczne zarządzanie użytkownikami, rolami, klientami i autoryzacja.
- **Obsługa wielu kanałów i pokoi** – podobnie jak na Discordzie.
- **Frontend w Next.js** – nowoczesny interfejs użytkownika.
- **Backend w Node.js** – logika serwera.
- **Baza danych MongoDB** – przechowywanie danych pokoi i przypisanych do nich ról.
- **Obsługa Docker i Kubernetes** – łatwe wdrażanie i skalowanie.
- **Igness i port-forwarding** - uruchamianie aplikacji i serwerów na wspólnej domenie.
- **Volumeny** - przechowywanie danych w wolumenach.
- **Certyfikaty TLS** – bezpieczna komunikacja.
- **Ograniczony dostęp do zasobów** – role i uprawnienia przypisane do użytkowników i pokoi.
- **Sekrety w Dockerze** – bezpieczne przechowywanie wrażliwych danych, takich jak klucze i hasła.
- **HPA** - skalowanie automatyczne.

## Struktura projektu

- **Frontend:** Next.js, React, EJS, CSS
- **Backend:** Node, http, Express, Websockety
- **Bazy danych:** MongoDB, postgreSQL dla keycloak
- **Infrastruktura:** Docker, Kubernetes, Keycloak, skrypt bash

---
  
Repozytorium DockerHub: https://hub.docker.com/u/jankotanimesigma
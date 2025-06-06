# Voice chat
### Wersja: 1.1 (DEV)

---

**Voice chat** to serwer komunikacyjny inspirowany platformą Discord, stworzony w ramach projektów na BAW oraz Technologie Aplikacji Chmurowych. Aplikacja umożliwia komunikację w czasie rzeczywistym z wykorzystaniem websocketów oraz integrację z systemem Keycloak do zarządzania użytkownikami. [Idź do preview](#preview)

> **Uwaga!** Aplikacja jest czysto deweloperska - wszystkie 
> zmienne aplikacji są publiczne, w żadnym wypadku nie 
> powinno się jej wykorzystwać do produkcji.

## Środowisko uruchomieniowe

### Wymagania:
- Docker + Docker Compose
- Kubernetes (kubectl)
- Node.js

## Instrukcja uruchomienia

### 1. Budowanie i uruchamianie z Dockerem:
1. Zmień zmienne w pliku `.env`, aby były zgodne z Twoim środowiskiem (np. IP) oraz ustaw porty w taki sposób, aby nie kolidowały z innymi aplikacjami
2. Zbuduj i uruchom kontenery:  
   `docker-compose up`

### 2. Uruchomienie na Kubernetes:
1. Dodaj do pliku `/etc/hosts` (wymagany administrator) linie `127.0.0.1 voice-chat.pl`
2. Uruchom skrypt `k8s_run.sh`
3. Poczekaj na włączenie się aplikacji, może to potrwać nawet około 5 minut
> **Uwaga!** Kubernetes nie posiada działającego klienta SSR 

### 3. Dane do logowania:
1. Konto administratora
- login `sigma` 
- hasło `sigma`
2. Konto użytkownika
- login `test`
- hasło `test`

## Funkcjonalności

- **SPA (Next.js)** - interfejs użytkownika z widokiem zależnym od roli ułatwiający korzystanie z serwisu.
- **SSR (Express z EJS)** - panel administracyjny ułatwiający przeglądanie informacji o pokojach i użytkownikach (tylko w `docker`).
- **Backend2Backend** - Połączenie serwera websocket a API do autoryzacji.
- **Websockety** – Komunikacja wielokanałowa w czasie rzeczystwistm.
- **Przesyłanie dźwięku** – zbieranie dźwięku z mikrofonu przeglądarki i wysyłanie ich do użytkowników w pokoju.
- **Integracja z Keycloak** – bezpieczne zarządzanie użytkownikami, rolami, klientami i autoryzacją w sposób scentralizowany.
- **Backend w Node.js** – serwerowa logika aplikacji.
- **MongoDB** – baza danych przechowująca informacje o pokojach i przypisanych rolach.
- **Postgres** – baza danych używana przez Keycloak (dla Kubernetes).
- **Docker i Kubernetes** – infrastruktura umożliwiająca łatwe wdrażanie i utrzymanie aplikacji.
- **Igness** - uruchamianie aplikacji i serwerów na wspólnej domenie.
- **Wolumeny** - trwałe przechowywanie danych w wolumenach.
- **Certyfikaty TLS** – zapewnienie szyfrowania komunikacji.
- **Kontrola dostępu** – zarządzanie uprawnieniami użytkowników i dostępem do pokoi.
- **Sekrety w Dockerze i Kubernetesie** – bezpieczne przechowywanie poufnych danych, takich jak tokeny, klucze i hasła.
- **HPA** - automatyczne skalowanie replik podów w zależności od obciążenia.
- **Własne obrazy** - obrazy tworzone specjalnie dla komponentów tej aplikacji.
- **PV i PVS** - przechowywanie danych aplikacji.

## Struktura projektu

- **Frontend:** Next.js, React, Express, EJS, CSS
- **Backend:** Node.js, HTTP, Express, WebSocket
- **Bazy danych:** MongoDB (pokoje), PostgreSQL (Keycloak)
- **Infrastruktura:** Docker, Kubernetes, Keycloak, Bash (skrypty)

## Preview

![voice-chat-1](https://github.com/user-attachments/assets/83df22d9-c429-4ac1-acb0-8b7ff36be5c6)
![voice-chat-2](https://github.com/user-attachments/assets/76919016-85c0-4be0-848b-2943fcd94cf4)
![voice-chat-3](https://github.com/user-attachments/assets/4c60beb9-4ba0-41ec-b0c2-3eff88e390c9)

---

## Repozytorium DockerHub 
https://hub.docker.com/u/jankotanimesigma

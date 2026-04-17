# FlexForBelsimpel

A phone and plan comparison tool built as a showcase project for [Belsimpel](https://www.belsimpel.nl). This project demonstrates the **complete Belsimpel tech stack** — from PHP/Laravel on the backend to React/TypeScript on the frontend, all orchestrated with Docker Compose.

**Live demo:** [forbelsimpel.chirilojoga.com](https://forbelsimpel.chirilojoga.com)

---
## Usage of AI
I used Claude Code to create the Dutch translations, database seeding, for bug scouting, for style (CSS) consistency, and for Hetzner integration, but this project is not vibe-coded.  

---

## Tech Stack

| Technology | Version | Used For |
|---|---|---|
| PHP | 8.3 | Backend runtime |
| Laravel | 11 | Framework: ORM, migrations, queues, events |
| GraphQL (Lighthouse) | 6 | API layer with schema-first approach |
| MariaDB | 11.2 | Primary database (8 domain tables) |
| Redis | 7.2 | Caching, sessions, rate limiting |
| Elasticsearch | 8.12 | Full-text search with fuzzy matching + faceted filters |
| RabbitMQ | 3.13 | Async message queue (ES sync, notifications) |
| React | 18 | Frontend UI library |
| TypeScript | 5.4 | Type-safe frontend code |
| React Router | v7 | Full-stack framework (SSR, loaders, actions) |
| Vite | 6 | Build tool + dev server |
| CSS Modules | — | Scoped component styles |
| Storybook | 8 | UI component catalog |
| Jest | 29 | Frontend tests |
| PHPUnit | 11 | Backend tests |
| Docker Compose | — | 8-service development environment |
| GitLab CI/CD | — | Lint → Test → Build → Deploy pipeline |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER                             │
│  React 18 + TypeScript + React Router v7 (SSR)          │
│  CSS Modules · urql GraphQL client                       │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 NGINX (Reverse Proxy)                     │
│     /graphql → PHP-FPM     /* → Node SSR (port 3000)    │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
           ▼                          ▼
┌─────────────────────┐  ┌───────────────────────────────┐
│  LARAVEL (PHP 8.3)  │  │  REACT ROUTER v7 (Node 20)   │
│  Lighthouse GraphQL │  │  SSR · Loaders · Actions      │
│  Eloquent ORM       │  └───────────────────────────────┘
│  Sanctum Auth       │
│  Queue Jobs         │
└──┬───┬───┬───┬──────┘
   │   │   │   │
   ▼   ▼   ▼   ▼
MariaDB  Redis  Elasticsearch  RabbitMQ
```

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

### Quick Start

```bash
# Clone the repo
git clone <repo-url> flex-for-belsimpel
cd flex-for-belsimpel

# Start all 8 Docker services
make up

# Run database migrations and seed with Dutch market data
make fresh

# Index phones and plans in Elasticsearch
make index

# Open the app
# http://localhost:8080        — Frontend
# http://localhost:8080/graphiql — GraphQL IDE
# http://localhost:6006        — Storybook
# http://localhost:15672       — RabbitMQ Management (guest/guest)
# http://localhost:8025        — Mailpit (email testing)
```

### Available Commands

```bash
make up          # Start all services
make down        # Stop all services
make fresh       # Migrate + seed database
make index       # Index data in Elasticsearch
make test        # Run all tests (PHPUnit + Jest)
make storybook   # Start Storybook dev server
make logs        # Tail all container logs
make shell-php   # Shell into the PHP container
make shell-node  # Shell into the Node container
```

---

## Project Structure

```
├── backend/                    # Laravel 11 application
│   ├── app/
│   │   ├── Console/Commands/   # Artisan commands (ES indexing)
│   │   ├── Events/             # PriceChanged event
│   │   ├── GraphQL/            # Queries + Mutations resolvers
│   │   ├── Jobs/               # Queue jobs (sync, notify)
│   │   ├── Listeners/          # Event handlers
│   │   ├── Models/             # Eloquent models (8)
│   │   ├── Notifications/      # Email notifications
│   │   ├── Observers/          # Model observers
│   │   └── Services/           # ElasticsearchService
│   ├── database/
│   │   ├── migrations/         # Schema definitions
│   │   └── seeders/            # Dutch market test data
│   └── graphql/                # Schema-first .graphql files
│
├── frontend/                   # React Router v7 application
│   ├── app/
│   │   ├── components/         # UI + domain components
│   │   ├── graphql/            # Queries and mutations
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities (GraphQL client, formatters)
│   │   ├── routes/             # Page components with loaders
│   │   └── styles/             # Global CSS + design tokens
│   └── .storybook/             # Storybook configuration
│
├── docker/                     # Dockerfiles for each service
├── docker-compose.yml          # 8-service orchestration
├── Makefile                    # Developer shortcuts
└── .gitlab-ci.yml              # CI/CD pipeline
```

---

## Features

- **Phone search** — Elasticsearch-powered with fuzzy matching and faceted filters (brand, price, storage)
- **Plan listing** — Filter by provider, data, network type (4G/5G), contract length
- **Phone comparison** — Side-by-side specs table for up to 4 phones
- **Wishlist** — Save favorites and set price alerts (Sanctum auth)
- **Price alerts** — RabbitMQ queue → email notifications via Mailpit
- **Recommendations** — Content-based similarity (same price range, OS, storage)
- **SSR** — Server-side rendered pages, no loading spinners
- **Storybook** — Interactive UI component catalog

---

## Database

25 real phones, 5 Dutch providers, 18 plans, ~450 phone+plan price combinations.

All seeded with realistic Dutch market data: KPN, Vodafone, T-Mobile, Tele2, and Simpel.

---

## Built by

**Chiril Ojoga** — as a showcase for Belsimpel job application

*Met zorg gebouwd voor Belsimpel* 🧡

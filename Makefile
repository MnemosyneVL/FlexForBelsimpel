# FlexForBelsimpel — Makefile
#
# Shortcut commands for common tasks. Instead of typing
# `docker compose exec php php artisan migrate`, just type `make migrate`.
#
# Usage:
#   make up          — Start all services
#   make down        — Stop all services
#   make migrate     — Run database migrations
#   make seed        — Seed the database with sample data
#   make fresh       — Drop all tables, re-migrate, and re-seed
#   make index       — Index phones and plans into Elasticsearch
#   make test        — Run all tests (backend + frontend)
#   make storybook   — Open Storybook component library

.PHONY: up down restart logs migrate seed fresh index test test-backend test-frontend storybook shell-php shell-node

# Start all services in the background
up:
	docker compose up -d

# Stop all services
down:
	docker compose down

# Restart all services
restart:
	docker compose restart

# View logs from all services (Ctrl+C to exit)
logs:
	docker compose logs -f

# --- BACKEND COMMANDS ---

# Run database migrations
migrate:
	docker compose exec php php artisan migrate

# Seed database with sample data
seed:
	docker compose exec php php artisan db:seed

# Drop everything, re-migrate, and re-seed (fresh start)
fresh:
	docker compose exec php php artisan migrate:fresh --seed

# Index all data into Elasticsearch
index:
	docker compose exec php php artisan es:index-phones
	docker compose exec php php artisan es:index-plans

# Run backend tests
test-backend:
	docker compose exec php php artisan test

# Open a bash shell inside the PHP container
shell-php:
	docker compose exec php sh

# --- FRONTEND COMMANDS ---

# Run frontend tests
test-frontend:
	docker compose exec node npm test

# Start Storybook component library on port 6006
storybook:
	docker compose exec node npm run storybook

# Open a bash shell inside the Node container
shell-node:
	docker compose exec node sh

# --- COMBINED ---

# Run all tests
test: test-backend test-frontend

# Full setup from scratch
setup: up
	@echo "Waiting for services to be healthy..."
	sleep 10
	docker compose exec php composer install
	docker compose exec php php artisan migrate:fresh --seed
	docker compose exec php php artisan es:index-phones
	docker compose exec php php artisan es:index-plans
	docker compose exec node npm install
	@echo "Setup complete! Visit http://localhost:8080"

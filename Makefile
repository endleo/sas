.PHONY: clean build test-local

APP_DIR := casino/app
IMAGE_NAME := casino-app
CONTAINER_NAME := casino-app-local

clean:
	rm -rf $(APP_DIR)/build
	rm -rf $(APP_DIR)/.svelte-kit
	rm -rf $(APP_DIR)/dist
	rm -rf $(APP_DIR)/node_modules/.vite

build:
	docker compose -f $(APP_DIR)/docker-compose.yml build

test-local:
	docker compose -f $(APP_DIR)/docker-compose.yml up --remove-orphans

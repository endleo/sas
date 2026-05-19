.PHONY: clean build test-local

clean:
	rm -rf casino/app/build
	rm -rf casino/app/.svelte-kit
	rm -rf casino/app/dist
	rm -rf casino/app/node_modules/.vite

build:
	@command -v pnpm >/dev/null 2>&1 || { echo "pnpm is not installed"; exit 1; }
	cd casino/app && pnpm build

test-local:
	@command -v pnpm >/dev/null 2>&1 || { echo "pnpm is not installed"; exit 1; }
	cd casino/app && pnpm dev

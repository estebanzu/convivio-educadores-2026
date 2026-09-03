.PHONY: help install dev start stop build preview format format-check lint audit security security-fix audit-fix clean

# ── Config ──────────────────────────────────────────────────────────
PORT        ?= 5173
PREVIEW_PORT ?= 4173
HOST        ?= 0.0.0.0
PID_FILE    := .vite.pid
PREVIEW_PID := .vite-preview.pid

# ── Default ─────────────────────────────────────────────────────────
help: ## Muestra esta ayuda
	@echo ""
	@echo "  Convivio de Educadores 2026 — Makefile"
	@echo "  Uso: make [target]"
	@echo ""
	@grep -E '^[a-zA-Z_0-9-]+:.*?## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'
	@echo ""

# ── Setup ───────────────────────────────────────────────────────────
install: ## Instala dependencias (npm ci)
	npm ci

# ── Dev / Prod ──────────────────────────────────────────────────────
dev: ## Inicia servidor de desarrollo (vite @ http://localhost:$(PORT))
	@echo "→ npm run dev -- --host $(HOST) --port $(PORT)"
	npm run dev -- --host $(HOST) --port $(PORT)

start: ## Compila y sirve preview en background (prod) — http://localhost:$(PREVIEW_PORT)
	@echo "→ Build + preview en background"
	npm run build
	@nohup npm run preview -- --host $(HOST) --port $(PREVIEW_PORT) > .preview.log 2>&1 & echo $$! > $(PREVIEW_PID)
	@echo "✓ Preview PID $$(cat $(PREVIEW_PID)) — log: .preview.log"
	@echo "  Abre: http://localhost:$(PREVIEW_PORT)"

build: ## Compila a dist/
	npm run build

preview: ## Preview foreground (requiere build previo)
	npm run preview -- --host $(HOST) --port $(PREVIEW_PORT)

stop: ## Detiene servidores vite/preview en background
	@echo "→ Deteniendo servidores..."
	@if [ -f $(PREVIEW_PID) ]; then \
		kill $$(cat $(PREVIEW_PID)) 2>/dev/null && echo "  ✓ preview $$(cat $(PREVIEW_PID)) detenido" || echo "  · preview ya detenido"; \
		rm -f $(PREVIEW_PID); \
	fi
	@if [ -f $(PID_FILE) ]; then \
		kill $$(cat $(PID_FILE)) 2>/dev/null && echo "  ✓ vite $$(cat $(PID_FILE)) detenido" || echo "  · vite ya detenido"; \
		rm -f $(PID_FILE); \
	fi
	@pkill -f "vite" 2>/dev/null && echo "  ✓ procesos vite restantes terminados" || echo "  · no hay procesos vite huérfanos"
	@echo "✓ stop completo"

# ── Calidad ─────────────────────────────────────────────────────────
format: ## Formatea código (Prettier — instala si falta)
	@if ! npx --yes prettier --version >/dev/null 2>&1; then \
		echo "→ Instalando prettier..."; npm i -D prettier >/dev/null 2>&1; \
	fi
	@echo "→ prettier --write"
	npx prettier --write "**/*.{js,css,html,json,md}" --ignore-path .gitignore 2>/dev/null || \
	npx prettier --write "src/**/*.{js,css}" "index.html" "*.{json,md,js}" 2>/dev/null || true
	@echo "✓ format listo"

format-check: ## Verifica formato sin escribir (CI)
	npx --yes prettier --check "**/*.{js,css,html,json,md}" --ignore-path .gitignore 2>/dev/null || \
	npx --yes prettier --check "src/**/*.{js,css}" "index.html" 2>/dev/null || true

lint: ## Lint (ESLint si existe config, si no hace check sintáctico)
	@if [ -f .eslintrc.js ] || [ -f .eslintrc.json ] || [ -f .eslintrc.cjs ] || [ -f eslint.config.js ]; then \
		echo "→ eslint ."; npx --yes eslint . --ext .js --max-warnings=0; \
	else \
		echo "· Sin config ESLint — haciendo check sintáctico con node --check"; \
		node --check src/main.js && echo "✓ src/main.js синтаксис OK"; \
		npx --yes --package=eslint eslint --version >/dev/null 2>&1 && echo "  Tip: agrega eslint para lint completo (npm i -D eslint)"; \
	fi

# ── Seguridad ───────────────────────────────────────────────────────
audit: ## Auditoría de vulnerabilidades (npm audit)
	npm audit --audit-level=moderate || true

security: audit ## Alias de audit

security-fix: ## Intenta corregir vulnerabilidades automáticamente
	npm audit fix || true
	@echo "→ Verifica de nuevo con: make audit"

audit-fix: security-fix ## Alias de security-fix

security-check: ## Auditoría + reporte de dependencias desactualizadas
	@echo "== npm audit =="
	@npm audit --audit-level=moderate || true
	@echo ""
	@echo "== npm outdated =="
	@npm outdated || true

# ── Utilidades ──────────────────────────────────────────────────────
clean: ## Limpia artefactos generados
	rm -rf dist node_modules/.vite .vite.pid .vite-preview.pid .preview.log
	@echo "✓ clean listo"


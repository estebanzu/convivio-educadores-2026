# convivio-educadores-2026

SPA RSVP para el **Convivio de Educadores 2026** — Parroquia Inmaculada Concepción (La Unión, Cartago).

Sitio estático, ligero y 100% compatible con **GitHub Pages**. Inspirado en Zola: layout limpio, tipografía elegante, móvil/desktop fluido.

![Vite](https://img.shields.io/badge/Vite-6.x-646CFF) ![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38BDF8) ![Static](https://img.shields.io/badge/Hosting-GitHub_Pages-222)

## ✨ Demo local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
npm run preview
```

## 📁 Estructura

```
invite-lilliam/
├── index.html                  # SPA single-page (Hero, Detalles, Itinerario, DressCode, RSVP)
├── public/
│   ├── hero-bg.jpg             # imagen invitación
│   └── invite-reference.jpg
├── src/
│   ├── main.js                 # countdown, timeline, RSVP logic, scroll
│   ├── style.css               # Tailwind + design tokens
│   └── data/
│       └── event.json          # ← fuente única de verdad (editar aquí para actualizar textos)
├── vite.config.js
├── package.json
└── .github/workflows/deploy.yml
```

## 🎨 Diseño

Tokens en `src/style.css` (`@theme`):

| Token              | Valor              | Uso                       |
| ------------------ | ------------------ | ------------------------- |
| `--color-burgundy` | `#6B1028`          | primario, CTA             |
| `--color-teal`     | `#167C7E`          | acento secundario, mapas  |
| `--color-gold`     | `#A9841F`          | títulos script, divisores |
| `--color-cream`    | `#FFFBF5`          | fondo                     |
| `--color-navy`     | `#1B3A5C`          | footer                    |
| `--font-display`   | Cormorant Garamond | títulos serif             |
| `--font-script`    | Great Vibes        | “Convivio de Educadores”  |
| `--font-body`      | DM Sans            | cuerpo                    |

Paleta extraída de la invitación original (burgundy/teal/dorado + pinceladas acuarela).

## 🔧 Datos desacoplados

Toda la copia vive en **`src/data/event.json`**:

- `hero.date.iso` → alimenta el countdown
- `eventDetails`, `itinerary[]`, `dressCode`, `notes`, `rsvp`

> Para actualizar fecha/lugar/textos: edita solo ese JSON y haz `npm run build`.

## 📩 Confirmación

Confirmación **exclusivamente por Google Forms** (no hay formulario local):

**https://forms.gle/cJ6bV2LZE9VbPtNc6**

> Agenda/itinerario aún no definido — se omitió del sitio hasta confirmar.

WhatsApp y teléfono son **solo para dudas**, no para confirmar.

## 🚀 Despliegue en GitHub Pages (automático)

El repo incluye `.github/workflows/deploy.yml`:

1. Crea repo en GitHub (ej. `estebanzu/convivio-educadores-2026`).
2. En GitHub → **Settings → Pages → Source: GitHub Actions**.
3. Push a `main` y el workflow publica `dist/` automáticamente.

**Manual:**

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:estebanzu/convivio-educadores-2026.git
git push -u origin main
```

> Si `base` necesita subpath (`/convivio-educadores-2026/`), cambia `base` en `vite.config.js`.

## 📅 Evento

- **Fecha:** Viernes 02 de octubre de 2026 — 2:30 p.m. (America/Costa_Rica)
- **Lugar:** Salón Parroquial, Parroquia Inmaculada Concepción, Concepción, La Unión, Cartago
- **Confirmación:** https://forms.gle/cJ6bV2LZE9VbPtNc6 (único medio)
- **Dudas — Parroquia:** ☎️ 2279 5760 · WhatsApp 8972 9668 (solo dudas) — https://wa.me/50689729668
- **Facebook:** https://www.facebook.com/parroquiaconcepcionlaunion/?locale=es_LA

---

Hecho con ♥ para la comunidad educativa.

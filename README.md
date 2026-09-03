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

## 📩 RSVP sin servidor (3 modos)

El formulario en `#rsvp` funciona sin backend, ideal para GitHub Pages:

1. **Formspree (recomendado)** — pon tu endpoint en `event.json → rsvp.formspreeEndpoint` (`https://formspree.io/f/XXXX`). Gratis, envía a email/Sheets.
2. **Google Sheets vía Apps Script** — crea un Web App que reciba `POST JSON` y lo guarde en Sheet. Guarda la URL en `localStorage.setItem('rsvp_webhook', url)`.
3. **Fallback local + WhatsApp** — si no hay endpoint, guarda en `localStorage` y ofrece abrir WhatsApp con mensaje pre-llenado (`wa.me/50688830657`). El sitio ya funciona en este modo sin configurar nada.

Campos: nombre, teléfono, asistencia (sí/no), acompañantes, institución, restricciones alimenticias, mensaje.

El enlace oficial original sigue disponible: https://forms.gle/cJ6bV2LZE9VbPtNc6

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
- **Lugar:** Salón Parroquial, Parroquia Inmaculada Concepción, La Unión, Cartago
- **Contacto:** https://wa.me/50688830657

---

Hecho con ♥ para la comunidad educativa.

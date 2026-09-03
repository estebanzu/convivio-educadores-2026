import "./style.css";
import eventData from "./data/event.json";

// ── Navbar scroll effect
const navbar = document.getElementById("navbar");
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      if (window.scrollY > 8) {
        navbar.classList.add("shadow-soft", "border-border");
        navbar.classList.remove("border-transparent");
      } else {
        navbar.classList.remove("shadow-soft", "border-border");
        navbar.classList.add("border-transparent");
      }
      ticking = false;
    });
    ticking = true;
  }
});

// ── Countdown con ARIA throttling (no spamear lectores)
const cdEl = document.getElementById("countdown");
const cdVisual = document.getElementById("countdown-visual");
const cdSr = document.getElementById("countdown-sr");
const cdLabel = document.getElementById("countdown-label");
const target = new Date(eventData.hero.date.iso);
let lastSrText = "";

function renderCountdown() {
  const now = new Date();
  let diff = target - now;

  if (diff <= 0) {
    const doneHtml = `<div class="col-span-4 rounded-2xl bg-white border border-border p-4 text-center"><p class="text-sm font-semibold text-primary">¡Hoy es el gran día! </p><p class="text-xs text-ink-light">Te esperamos a las 2:30 p.m. en el Salón Parroquial.</p></div>`;
    if (cdVisual) cdVisual.innerHTML = doneHtml;
    else if (cdEl) cdEl.innerHTML = doneHtml;
    if (cdSr) cdSr.textContent = "¡Hoy es el gran día! Te esperamos a las 2:30 p.m. en el Salón Parroquial.";
    if (cdLabel) cdLabel.textContent = "¡Nos vemos hoy!";
    return;
  }

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const mins = Math.floor(diff / 60000);
  diff %= 60000;
  const secs = Math.floor(diff / 1000);

  const units = [
    { v: days, l: "días" },
    { v: hours, l: "horas" },
    { v: mins, l: "min" },
    { v: secs, l: "seg" },
  ];

  const visualEl = cdVisual || cdEl;
  if (visualEl) {
    visualEl.innerHTML = units
      .map(
        (u) => `
    <div class="rounded-2xl bg-white border border-border shadow-soft p-3 sm:p-4 text-center">
      <div class="font-display font-bold text-[26px] sm:text-[30px] leading-none text-primary">${String(u.v).padStart(2, "0")}</div>
      <div class="mt-1 text-[10px] tracking-[0.16em] uppercase font-semibold text-ink-faint">${u.l}</div>
    </div>
  `,
      )
      .join("");
  }

  // Throttle SR announcement: solo cuando cambian minutos (cada 60s) para no saturar NVDA/VoiceOver
  if (cdSr) {
    const srText = `Faltan ${days} días, ${hours} horas y ${mins} minutos para el Convivio de Educadores`;
    if (srText !== lastSrText && (secs === 0 || lastSrText === "")) {
      cdSr.textContent = srText;
      lastSrText = srText;
    }
  }
}

renderCountdown();
setInterval(renderCountdown, 1000);

// ── Dress & Notes
document.getElementById("dress-notes").innerHTML = eventData.dressCode.notes
  .map((n) => `<li>${n}</li>`)
  .join("");
document.getElementById("notes-list").innerHTML = eventData.notes
  .map(
    (n) =>
      `<li class="flex gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0"></span><span>${n}</span></li>`,
  )
  .join("");

// ── Add to calendar
document.getElementById("add-calendar")?.addEventListener("click", () => {
  const title = encodeURIComponent(
    "Convivio de Educadores — Parroquia Inmaculada Concepción de La Unión",
  );
  const details = encodeURIComponent(eventData.eventDetails.objective);
  const location = encodeURIComponent("Salón Parroquial, La Unión, Cartago");
  const start = "20261002T143000";
  const end = "20261002T173000";
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  window.open(url, "_blank", "noopener");
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:20261002T203000Z\nDTEND:20261002T233000Z\nSUMMARY:${decodeURIComponent(title)}\nDESCRIPTION:${decodeURIComponent(details)}\nLOCATION:${decodeURIComponent(location)}\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "convivio-educadores-2026.ics";
  a.click();
});

// ── Smooth scroll for anchor links (offset handled via CSS scroll-padding)
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const targetEl = document.querySelector(id);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// ── Micro-delighter: watermark parallax sutil (respeta reduced-motion)
const wmImg = document.querySelector(".watermark img");
if (wmImg && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  let wmTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!wmTicking) {
        requestAnimationFrame(() => {
          const y = window.scrollY * 0.015;
          wmImg.style.transform = `translateY(${y}px)`;
          wmTicking = false;
        });
        wmTicking = true;
      }
    },
    { passive: true },
  );
}

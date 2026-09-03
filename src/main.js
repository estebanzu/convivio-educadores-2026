import './style.css'
import eventData from './data/event.json'

// ── helpers
const $ = (s) => document.querySelector(s)

// ── Navbar scroll effect
const navbar = document.getElementById('navbar')
let ticking = false
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      if (window.scrollY > 8) {
        navbar.classList.add('shadow-soft', 'border-border')
        navbar.classList.remove('border-transparent')
      } else {
        navbar.classList.remove('shadow-soft', 'border-border')
        navbar.classList.add('border-transparent')
      }
      ticking = false
    })
    ticking = true
  }
})

// ── Countdown
const cdEl = document.getElementById('countdown')
const cdLabel = document.getElementById('countdown-label')
const target = new Date(eventData.hero.date.iso)

function renderCountdown() {
  const now = new Date()
  let diff = target - now

  if (diff <= 0) {
    cdEl.innerHTML = `<div class="col-span-4 rounded-2xl bg-white border border-border p-4 text-center"><p class="text-sm font-semibold text-burgundy">¡Hoy es el gran día! 🎉</p><p class="text-xs text-ink-light">Te esperamos a las 2:30 p.m. en el Salón Parroquial.</p></div>`
    if (cdLabel) cdLabel.textContent = '¡Nos vemos hoy!'
    return
  }

  const days = Math.floor(diff / 86400000)
  diff %= 86400000
  const hours = Math.floor(diff / 3600000)
  diff %= 3600000
  const mins = Math.floor(diff / 60000)
  diff %= 60000
  const secs = Math.floor(diff / 1000)

  const units = [
    { v: days, l: 'días' },
    { v: hours, l: 'horas' },
    { v: mins, l: 'min' },
    { v: secs, l: 'seg' },
  ]

  cdEl.innerHTML = units.map(u => `
    <div class="rounded-2xl bg-white border border-border shadow-soft p-3 sm:p-4 text-center">
      <div class="font-display font-bold text-[26px] sm:text-[30px] leading-none text-burgundy">${String(u.v).padStart(2,'0')}</div>
      <div class="mt-1 text-[10px] tracking-[0.16em] uppercase font-semibold text-ink-faint">${u.l}</div>
    </div>
  `).join('')
}

renderCountdown()
setInterval(renderCountdown, 1000)

// ── Timeline
const timeline = document.getElementById('timeline')
const icons = {
  hand: '👋', sparkles: '✨', users: '🤝', coffee: '☕', heart: '💛'
}
timeline.innerHTML = eventData.itinerary.map((item, i) => {
  const isLeft = i % 2 === 0
  return `
  <div class="relative flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0 mb-6 last:mb-0">
    <!-- dot -->
    <div class="absolute left-[11px] sm:left-1/2 sm:-translate-x-1/2 top-6 w-[15px] h-[15px] rounded-full bg-white border-[3px] border-gold shadow-sm z-10"></div>
    <!-- spacer for center -->
    <div class="hidden sm:block sm:w-1/2 ${isLeft ? 'sm:pr-10 sm:text-right sm:items-end' : 'sm:order-2 sm:pl-10'} flex justify-end sm:justify-${isLeft ? 'end' : 'start'}">
      ${isLeft ? card(item, 'sm:text-right') : ''}
    </div>
    <div class="hidden sm:block sm:w-1/2 ${isLeft ? 'sm:order-2 sm:pl-10' : 'sm:pr-10 sm:text-right'}">
      ${!isLeft ? card(item, 'sm:text-left') : ''}
    </div>
    <!-- mobile card -->
    <div class="sm:hidden ml-10 flex-1">${card(item, '')}</div>
  </div>`
}).join('')

function card(item, align) {
  return `
  <div class="rounded-2xl bg-white border border-border p-5 shadow-soft text-left ${align}">
    <div class="flex items-center gap-2 ${align.includes('text-right') ? 'sm:justify-end' : ''}">
      <span class="w-8 h-8 rounded-full bg-cream border border-border grid place-items-center text-sm">${icons[item.icon] || '•'}</span>
      <span class="text-xs font-bold tracking-[0.12em] uppercase text-teal">${item.time}</span>
    </div>
    <h4 class="mt-2 font-semibold text-[15px]">${item.title}</h4>
    <p class="mt-1 text-sm leading-relaxed text-ink-light">${item.description}</p>
  </div>`
}

// Alternate: inject vertical line handled statically; ensure dot visibility

// ── Dress & Notes
document.getElementById('dress-notes').innerHTML = eventData.dressCode.notes.map(n => `<li>${n}</li>`).join('')
document.getElementById('notes-list').innerHTML = eventData.notes.map(n => `<li class="flex gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0"></span><span>${n}</span></li>`).join('')

// ── Add to calendar
document.getElementById('add-calendar')?.addEventListener('click', () => {
  // Google Calendar link
  const title = encodeURIComponent('Convivio de Educadores — Parroquia Inmaculada Concepción')
  const details = encodeURIComponent(eventData.eventDetails.objective)
  const location = encodeURIComponent('Salón Parroquial, La Unión, Cartago')
  // 2:30pm to 5:30pm Costa Rica (UTC-6)
  const start = '20261002T143000'
  const end = '20261002T173000'
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`
  window.open(url, '_blank', 'noopener')
  // also try ICS download
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:20261002T203000Z\nDTEND:20261002T233000Z\nSUMMARY:${decodeURIComponent(title)}\nDESCRIPTION:${decodeURIComponent(details)}\nLOCATION:${decodeURIComponent(location)}\nEND:VEVENT\nEND:VCALENDAR`
  const blob = new Blob([ics], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'convivio-educadores-2026.ics'
  a.click()
})

// ── RSVP form
const form = document.getElementById('rsvp-form')
const successBox = document.getElementById('form-success')
const submitBtn = document.getElementById('submit-btn')
const submitLabel = document.getElementById('submit-label')
const spinner = document.getElementById('submit-spinner')
const errorBox = document.getElementById('form-error')

function showError(msg) {
  errorBox.textContent = msg
  errorBox.classList.remove('hidden')
}
function clearError() { errorBox.classList.add('hidden'); errorBox.textContent = '' }

function validate() {
  let ok = true
  const name = document.getElementById('f-name').value.trim()
  const att = document.getElementById('f-attendance').value
  const eName = document.getElementById('e-name')
  const eAtt = document.getElementById('e-attendance')
  eName.classList.add('hidden'); eAtt.classList.add('hidden')
  if (!name || name.length < 3) { eName.textContent = 'Ingresa tu nombre completo (mín. 3 caracteres).'; eName.classList.remove('hidden'); ok = false }
  if (!att) { eAtt.textContent = 'Selecciona si asistirás o no.'; eAtt.classList.remove('hidden'); ok = false }
  return ok
}

function toast(msg) {
  const t = document.getElementById('toast')
  document.getElementById('toast-msg').textContent = msg
  t.classList.remove('hidden'); t.classList.add('flex')
  setTimeout(() => { t.classList.add('hidden'); t.classList.remove('flex') }, 3000)
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  clearError()
  if (!validate()) return

  const data = {
    nombre: document.getElementById('f-name').value.trim(),
    telefono: document.getElementById('f-phone').value.trim(),
    asistencia: document.getElementById('f-attendance').value,
    acompanantes: document.getElementById('f-guests').value,
    institucion: document.getElementById('f-school').value.trim(),
    restricciones: document.getElementById('f-diet').value.trim(),
    mensaje: document.getElementById('f-message').value.trim(),
    fecha: new Date().toISOString(),
    evento: 'Convivio de Educadores 2026'
  }

  submitBtn.disabled = true
  submitLabel.textContent = 'Enviando…'
  spinner.classList.remove('hidden')

  try {
    const endpoint = eventData.rsvp.formspreeEndpoint?.trim()

    if (endpoint) {
      // Formspree mode
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Formspree error')
      onSuccess(data, 'Formspree')
    } else {
      // Try Google Sheets webhook if configured via localStorage (advanced)
      const webhook = localStorage.getItem('rsvp_webhook') // optional Apps Script URL
      if (webhook) {
        const res = await fetch(webhook, { method: 'POST', body: JSON.stringify(data) })
        if (!res.ok) throw new Error('Webhook error')
        onSuccess(data, 'Sheets')
      } else {
        // Fallback: store locally + offer WhatsApp prefill
        const stored = JSON.parse(localStorage.getItem('rsvp_submissions') || '[]')
        stored.push(data)
        localStorage.setItem('rsvp_submissions', JSON.stringify(stored))

        // Simulate network delay
        await new Promise(r => setTimeout(r, 700))
        onSuccess(data, 'local')

        // Offer to open WhatsApp with prefilled message
        const waMsg = encodeURIComponent(
          `Hola! Confirmo para el Convivio de Educadores 2026:\n\n` +
          `Nombre: ${data.nombre}\n` +
          `Asistencia: ${data.asistencia === 'sí' ? 'Sí, asistiré' : 'No podré asistir'}\n` +
          `Acompañantes: ${data.acompanantes}\n` +
          (data.institucion ? `Institución: ${data.institucion}\n` : '') +
          (data.restricciones ? `Alimentación: ${data.restricciones}\n` : '') +
          (data.mensaje ? `Mensaje: ${data.mensaje}` : '')
        )
        // don't auto-open, but hint
        setTimeout(() => {
          if (confirm('¿Quieres enviar tu confirmación también por WhatsApp?')) {
            window.open(`https://wa.me/50688830657?text=${waMsg}`, '_blank', 'noopener')
          }
        }, 400)
      }
    }
  } catch (err) {
    console.error(err)
    showError('No se pudo enviar. Por favor usa el formulario oficial de Google o WhatsApp. Tus datos se guardaron localmente.')
    // still store locally
    const stored = JSON.parse(localStorage.getItem('rsvp_submissions') || '[]')
    stored.push(data)
    localStorage.setItem('rsvp_submissions', JSON.stringify(stored))
    toast('Guardado localmente — usa Google Forms como respaldo')
  } finally {
    submitBtn.disabled = false
    submitLabel.textContent = 'Enviar confirmación'
    spinner.classList.add('hidden')
  }
})

function onSuccess(data, mode) {
  form.classList.add('hidden')
  successBox.classList.remove('hidden')
  const summary = `Nombre: ${data.nombre} · ${data.asistencia === 'sí' ? 'Asistiré' : 'No asistiré'}${data.acompanantes !== '0' ? ` +${data.acompanantes}` : ''} · ${mode === 'local' ? 'guardado local' : 'enviado'}`
  document.getElementById('success-summary').textContent = summary
  toast('¡Confirmación enviada!')
  // scroll to success
  successBox.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// ── Smooth scroll for anchor links (offset handled via CSS scroll-padding)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')
    if (id.length > 1) {
      const target = document.querySelector(id)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  })
})

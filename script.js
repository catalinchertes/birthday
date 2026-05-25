document.addEventListener('DOMContentLoaded', () => {

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFIbXjnjfK9SDAv25MT_lnhxXhjx_Y_RRqXW3Pg0Mb-L3rTd-4Sv0-RdufTghXNTFm/exec';

// ── Estrellas ──
const starsContainer = document.getElementById('stars-container');
for (let i = 0; i < 40; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top  = `${Math.random() * 100}%`;
  star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
  star.style.setProperty('--delay',    `${Math.random() * 4}s`);
  star.style.opacity = (0.2 + Math.random() * 0.7).toFixed(2);
  const size = 4 + Math.random() * 5;
  star.style.width  = `${size}px`;
  star.style.height = `${size}px`;
  starsContainer.appendChild(star);
}

// ── Countdown ──
const targetDate = new Date('2026-06-27T14:00:00');
function updateCountdown() {
  const diff = targetDate - new Date();
  const t = diff > 0 ? Math.floor(diff / 1000) : 0;
  document.querySelector('#cd-days .cd-number').textContent    = Math.floor(t / 86400);
  document.querySelector('#cd-hours .cd-number').textContent   = String(Math.floor((t % 86400) / 3600)).padStart(2, '0');
  document.querySelector('#cd-minutes .cd-number').textContent = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
  document.querySelector('#cd-seconds .cd-number').textContent = String(t % 60).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── Animate on scroll ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
}, { threshold: 0 });
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  if (el.getBoundingClientRect().top < window.innerHeight) {
    el.classList.add('is-visible');
  } else {
    observer.observe(el);
  }
});

// ── DOM refs ──
const rsvpYes          = document.getElementById('rsvp-yes');
const rsvpNo           = document.getElementById('rsvp-no');
const labelYes         = document.getElementById('label-yes');
const labelNo          = document.getElementById('label-no');
const rsvpNameWrapper  = document.getElementById('rsvpNameWrapper');
const rsvpExtra        = document.getElementById('rsvpExtra');
const rsvpHand         = document.getElementById('rsvpHand');
const rsvpName         = document.getElementById('rsvpName');
const companionYes     = document.getElementById('companion-yes');
const companionNo      = document.getElementById('companion-no');
const labelWithYes     = document.getElementById('label-with-yes');
const labelWithNo      = document.getElementById('label-with-no');
const guestsWrapper    = document.getElementById('rsvpGuestsWrapper');
const rsvpGuests       = document.getElementById('rsvpGuests');
const confirmBtn       = document.getElementById('rsvpConfirmBtn');
const rsvpForm         = document.getElementById('rsvpForm');
const rsvpConfirmedMsg = document.getElementById('rsvpConfirmedMsg');
const rsvpConfirmedIcon= document.getElementById('rsvpConfirmedIcon');
const rsvpConfirmedText= document.getElementById('rsvpConfirmedText');
const rsvpGiftsLink    = document.getElementById('rsvpGiftsLink');
const section3         = document.getElementById('section3');

// ── Scroll al final ──
function scrollToBottom() {
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 150);
}

// ── Validación ──
function validateForm() {
  const hasName = rsvpName.value.trim().length > 0;
  if (!rsvpYes.checked && !rsvpNo.checked) { confirmBtn.disabled = true; return; }
  if (rsvpNo.checked) { confirmBtn.disabled = !hasName; return; }
  // Sí asiste
  confirmBtn.disabled = !(
    hasName &&
    (companionYes.checked || companionNo.checked) &&
    (companionYes.checked ? rsvpGuests.value !== '' : true)
  );
}

// ── Enviar a Apps Script ──
function submitToSheet(data) {
  const params = new URLSearchParams({
    attendance: data.attending ? 'yes' : 'no',
    name:       data.name,
    guests:     data.guests || 0
  });
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })
  .then(r => r.json())
  .then(res => console.log('Sheet response:', res))
  .catch(err => console.error('Sheet error:', err));
}

// ── Aplicar estado confirmado ──
function applyConfirmedState(data) {
  rsvpForm.style.display = 'none';
  rsvpConfirmedMsg.style.display = 'flex';

  if (data.attending) {
    rsvpHand.src                  = 'mickeyhappy.png';
    rsvpConfirmedIcon.textContent = '🎉';
    rsvpConfirmedText.innerHTML   = `<strong>${data.name}</strong>, ai confirmat cu succes prezența. Ne vedem pe 27 iunie! 🎉`;
    rsvpGiftsLink.style.display   = 'inline-flex';
    section3.style.display        = 'flex';
  } else {
    rsvpHand.src                  = 'mickeysad.png';
    rsvpConfirmedIcon.textContent = '😢';
    rsvpConfirmedText.innerHTML   = `<strong>${data.name}</strong>, înțelegem că nu poți veni. Îți trimitem gânduri bune! 💙`;
    rsvpGiftsLink.style.display   = 'none';
    section3.style.display        = 'none';
  }
}

// ── Restaurar desde localStorage ──
try {
  const saved = localStorage.getItem('brianRSVP');
  if (saved) {
    const data = JSON.parse(saved);
    if (data && typeof data.attending === 'boolean') applyConfirmedState(data);
  }
} catch (e) {
  localStorage.removeItem('brianRSVP');
}

// ── Eventos radios principales ──
rsvpYes.addEventListener('change', () => {
  labelYes.classList.add('selected-yes');
  labelYes.classList.remove('selected-no');
  labelNo.classList.remove('selected-no', 'selected-yes');
  rsvpHand.src = 'mickeyhappy.png';
  rsvpNameWrapper.classList.add('visible');
  rsvpExtra.classList.add('visible');
  validateForm();
  scrollToBottom();
});

rsvpNo.addEventListener('change', () => {
  labelNo.classList.add('selected-no');
  labelNo.classList.remove('selected-yes');
  labelYes.classList.remove('selected-yes', 'selected-no');
  rsvpHand.src = 'mickeysad.png';
  rsvpNameWrapper.classList.add('visible');
  rsvpExtra.classList.remove('visible');
  validateForm();
  scrollToBottom();
});

// ── Eventos acompañante ──
companionYes.addEventListener('change', () => {
  labelWithYes.classList.add('selected-yes');
  labelWithNo.classList.remove('selected-yes');
  guestsWrapper.classList.add('visible');
  validateForm();
  scrollToBottom();
});

companionNo.addEventListener('change', () => {
  labelWithNo.classList.add('selected-yes');
  labelWithYes.classList.remove('selected-yes');
  guestsWrapper.classList.remove('visible');
  rsvpGuests.value = '';
  validateForm();
  scrollToBottom();
});

rsvpName.addEventListener('input', validateForm);
rsvpGuests.addEventListener('change', validateForm);

// ── Confirmar ──
confirmBtn.addEventListener('click', () => {
  const guestsVal = rsvpGuests.value ? parseInt(rsvpGuests.value) : 0;
  const data = {
    attending: rsvpYes.checked,
    name:      rsvpName.value.trim(),
    guests:    guestsVal
  };
  localStorage.setItem('brianRSVP', JSON.stringify(data));
  submitToSheet(data);
  applyConfirmedState(data);
  if (data.attending) {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 400);
  }
});

// ── Botón lista cadouri ──
rsvpGiftsLink.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

  // ── Flecha sección 1 → sección 2 ──
document.getElementById('scrollToSection2').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('section2').scrollIntoView({ behavior: 'smooth' });
});
  
}); // fin DOMContentLoaded

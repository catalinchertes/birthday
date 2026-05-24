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
}, { threshold: 0.15 });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ── DOM refs ──
const rsvpYes           = document.getElementById('rsvp-yes');
const rsvpNo            = document.getElementById('rsvp-no');
const labelYes          = document.getElementById('label-yes');
const labelNo           = document.getElementById('label-no');
const rsvpExtra         = document.getElementById('rsvpExtra');
const rsvpHand          = document.getElementById('rsvpHand');
const rsvpName          = document.getElementById('rsvpName');
const companionYes      = document.getElementById('companion-yes');
const companionNo       = document.getElementById('companion-no');
const labelWithYes      = document.getElementById('label-with-yes');
const labelWithNo       = document.getElementById('label-with-no');
const guestsWrapper     = document.getElementById('rsvpGuestsWrapper');
const rsvpGuests        = document.getElementById('rsvpGuests');
const confirmBtn        = document.getElementById('rsvpConfirmBtn');
const rsvpForm          = document.getElementById('rsvpForm');
const rsvpConfirmedMsg  = document.getElementById('rsvpConfirmedMsg');
const rsvpConfirmedIcon = document.getElementById('rsvpConfirmedIcon');
const rsvpConfirmedText = document.getElementById('rsvpConfirmedText');
const rsvpGiftsLink     = document.getElementById('rsvpGiftsLink');
const section3          = document.getElementById('section3');
const confirmTitle      = document.getElementById('confirmTitle');
const confirmMsg        = document.getElementById('confirmMsg');
const confirmIcon       = document.getElementById('confirmIcon');
const section3gifts     = document.getElementById('section3-gifts');

// ── Scroll ──
function scrollToBottom() {
  setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }, 150);
}

// ── Validación ──
function validateForm() {
  if (!rsvpYes.checked && !rsvpNo.checked) { confirmBtn.disabled = true; return; }
  if (rsvpNo.checked) { confirmBtn.disabled = false; return; }
  confirmBtn.disabled = !(
    rsvpName.value.trim().length > 0 &&
    (companionYes.checked || companionNo.checked) &&
    (companionYes.checked ? rsvpGuests.value !== '' : true)
  );
}

// ── Aplicar estado confirmado ──
function applyConfirmedState(data) {
  rsvpForm.style.display = 'none';
  rsvpConfirmedMsg.classList.add('visible');
  section3.classList.add('unlocked');
  section3.setAttribute('aria-hidden', 'false');

  if (data.attending) {
    rsvpHand.src = 'mickeyhappy.png';
    rsvpConfirmedIcon.textContent = '🎉';
    rsvpConfirmedText.innerHTML = `<strong>${data.name}</strong>, ai confirmat cu succes prezența. Ne vedem pe 27 iunie! 🎉`;
    rsvpGiftsLink.classList.remove('hidden');
    confirmIcon.textContent  = '🎉';
    confirmTitle.textContent = 'Ne bucurăm că vii!';
    confirmMsg.innerHTML     = `Te așteptăm pe <strong>${data.name}</strong> pe 27 iunie la ora 14:00 la Consist Parc.<br/>Pregătește-te pentru tort, baloane și multă iubire! 🎂`;
    section3gifts.style.display = 'block';
  } else {
    rsvpHand.src = 'mickeysad.png';
    rsvpConfirmedIcon.textContent = '😢';
    rsvpConfirmedText.innerHTML = 'Înțelegem, ne pare rău că nu poți veni. Îți trimitem gânduri bune! 💙';
    rsvpGiftsLink.classList.add('hidden');
    confirmIcon.textContent  = '😢';
    confirmTitle.textContent = 'Ne pare rău că nu poți veni!';
    confirmMsg.innerHTML     = 'Îți trimitem gânduri bune și sperăm să ne vedem cu altă ocazie. 💙';
    section3gifts.style.display = 'none';
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

// ── Eventos ──
rsvpYes.addEventListener('change', () => {
  labelYes.classList.add('selected-yes');
  labelYes.classList.remove('selected-no');
  labelNo.classList.remove('selected-no', 'selected-yes');
  rsvpHand.src = 'mickeyhappy.png';
  rsvpExtra.classList.add('visible');
  validateForm();
  scrollToBottom();
});

rsvpNo.addEventListener('change', () => {
  labelNo.classList.add('selected-no');
  labelNo.classList.remove('selected-yes');
  labelYes.classList.remove('selected-yes', 'selected-no');
  rsvpHand.src = 'mickeysad.png';
  rsvpExtra.classList.remove('visible');
  validateForm();
  scrollToBottom();
});

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

confirmBtn.addEventListener('click', () => {
  const data = { attending: rsvpYes.checked, name: rsvpName.value.trim() };
  localStorage.setItem('brianRSVP', JSON.stringify(data));
  applyConfirmedState(data);
  setTimeout(() => section3.scrollIntoView({ behavior: 'smooth' }), 150);
});

rsvpGiftsLink.addEventListener('click', (e) => {
  e.preventDefault();
  section3.scrollIntoView({ behavior: 'smooth' });
});

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#section3' && !section3.classList.contains('unlocked')) {
    history.replaceState(null, '', '#section2');
    document.getElementById('section2').scrollIntoView({ behavior: 'smooth' });
  }
});

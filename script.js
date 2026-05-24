const starsContainer = document.getElementById('stars-container');
const STAR_COUNT = 40;

for (let i = 0; i < STAR_COUNT; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
  star.style.setProperty('--delay', `${Math.random() * 4}s`);
  star.style.opacity = (0.2 + Math.random() * 0.7).toFixed(2);
  const size = 4 + Math.random() * 5;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  starsContainer.appendChild(star);
}

const targetDate = new Date('2026-06-27T14:00:00');

const daysEl    = document.querySelector('#cd-days .cd-number');
const hoursEl   = document.querySelector('#cd-hours .cd-number');
const minutesEl = document.querySelector('#cd-minutes .cd-number');
const secondsEl = document.querySelector('#cd-seconds .cd-number');

function updateCountdown() {
  const now  = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    daysEl.textContent    = '0';
    hoursEl.textContent   = '0';
    minutesEl.textContent = '0';
    secondsEl.textContent = '0';
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days    = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours   = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent    = days;
  hoursEl.textContent   = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
/* ─────────────────────────────────────────
   KCS CONSULTANCY — SCRIPTS
   ───────────────────────────────────────── */

'use strict';
emailjs.init("CxWSPfjkIq1fEhj6f");

/* ── STICKY HEADER ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── MOBILE NAV ── */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav on link click
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── ACTIVE NAV LINK ON SCROLL ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

function setActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll(
  '.service-card, .why__card, .result-item, .testi-card, .about__content, .about__visual, .faq__item, .contact__card, .contact__form, .booking__info, .booking__form, .stat, .section__header'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq__item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if was closed)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── BOOKING FORM VALIDATION ── */
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(`${inputId}-error`);
  if (input) input.classList.add('error');
  if (errorEl) errorEl.textContent = message;
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(`${inputId}-error`);
  if (input) input.classList.remove('error');
  if (errorEl) errorEl.textContent = '';
}

function validateBookingForm() {
  let valid = true;

  ['fname', 'email', 'phone', 'mdate', 'mtime', 'mtype'].forEach(id => clearError(id));

  const fname = document.getElementById('fname').value.trim();
  if (!fname) { showError('fname', 'Please enter your full name.'); valid = false; }

  const email = document.getElementById('email').value.trim();
  if (!email) {
    showError('email', 'Please enter your email address.'); valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Please enter a valid email address.'); valid = false;
  }

  const phone = document.getElementById('phone').value.trim();
  if (!phone) {
    showError('phone', 'Please enter your phone number.'); valid = false;
  } else if (!/^[+\d\s\-()]{7,}$/.test(phone)) {
    showError('phone', 'Please enter a valid phone number.'); valid = false;
  }

  const mdate = document.getElementById('mdate').value;
  if (!mdate) {
    showError('mdate', 'Please select a meeting date.'); valid = false;
  } else {
    const selected = new Date(mdate);
    const today = new Date(); today.setHours(0,0,0,0);
    if (selected < today) { showError('mdate', 'Please select a future date.'); valid = false; }
  }

  const mtime = document.getElementById('mtime').value;
  if (!mtime) { showError('mtime', 'Please select a time slot.'); valid = false; }

  const mtype = document.getElementById('mtype').value;
  if (!mtype) { showError('mtype', 'Please select a meeting type.'); valid = false; }

  return valid;
}

if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateBookingForm()) return;

    const btn = bookingForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = {
      fname: document.getElementById('fname').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      mdate: document.getElementById('mdate').value,
      mtime: document.getElementById('mtime').value,
      mtype: document.getElementById('mtype').value,
      notes: document.getElementById('notes').value
    };

    emailjs.send("kcsbusiness", "template_hwjx609", data)
      .then(() => {
        bookingForm.style.display = 'none';
        bookingSuccess.style.display = 'flex';
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to send. Try again.");
        btn.textContent = 'Request Consultation';
        btn.disabled = false;
      });
  });
}

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      contactForm.reset();
      contactSuccess.style.display = 'block';
      setTimeout(() => { contactSuccess.style.display = 'none'; }, 5000);
    }, 900);
  });
}

/* ── SCROLL TO TOP ── */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── SET MIN DATE ON BOOKING INPUT ── */
const mdateInput = document.getElementById('mdate');
if (mdateInput) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  mdateInput.min = tomorrow.toISOString().split('T')[0];
}

/* ── SMOOTH TYPING CURSOR EFFECT ON HERO ── */
const heroTitle = document.querySelector('.hero__title');
if (heroTitle) {
  heroTitle.style.borderRight = 'none'; // Ensure no native cursor
}

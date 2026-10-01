const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'Close' : 'Menu';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = 'Menu';
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Configure the form backend once you create a form endpoint.
// Example for Formspree: https://formspree.io/f/your-form-id
const WEBOLY_FORM_ENDPOINT = 'https://formspree.io/f/mbglepypD';

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const submitButton = form?.querySelector('button[type="submit"]');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (WEBOLY_FORM_ENDPOINT.includes('REPLACE_WITH_YOUR_FORM_ID')) {
    if (note) {
      note.textContent = 'Contact form is not connected yet. Add the WEBOLY form endpoint in script.js.';
      note.classList.add('error');
    }
    return;
  }

  const originalButtonText = submitButton?.innerHTML || 'Send enquiry';
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending…';
  }
  if (note) {
    note.textContent = 'Sending your enquiry…';
    note.classList.remove('error');
  }

  try {
    const response = await fetch(WEBOLY_FORM_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    form.reset();
    if (note) {
      note.textContent = 'Thanks — your enquiry has been received. We’ll get back to you soon.';
      note.classList.remove('error');
    }
  } catch (error) {
    console.error('WEBOLY contact form error:', error);
    if (note) {
      note.textContent = 'We could not send your enquiry right now. Please try again in a moment.';
      note.classList.add('error');
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }
});

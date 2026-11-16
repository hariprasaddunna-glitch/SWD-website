// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
}

// Booking form -> Google Apps Script (writes to your Pre-Scheduled Appointments sheet)
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  const bookingStatus = document.getElementById('bookingStatus');
  const bookingBtn = document.getElementById('bookingSubmitBtn');
  bookingForm.addEventListener('submit', function () {
    bookingBtn.disabled = true;
    bookingBtn.textContent = 'Sending...';
    // Form submits natively into the hidden iframe (no page reload, no CORS issue).
    setTimeout(function () {
      bookingBtn.disabled = false;
      bookingBtn.textContent = 'Send request';
      bookingStatus.textContent = 'Thanks! Your request has been sent \u2014 we\u2019ll confirm your slot shortly.';
      bookingForm.reset();
    }, 900);
  });
}

// Google reviews (data comes from reviews-data.js)
function esc(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
function renderReviews() {
  const list = (Array.isArray(window.GOOGLE_REVIEWS) ? window.GOOGLE_REVIEWS : []).filter(r => r && r.name && r.text);
  const meta = window.GOOGLE_RATING || {};
  const stars = n => '\u2605'.repeat(n) + '\u2606'.repeat(5 - n);
  const clamp = v => Math.max(1, Math.min(5, Math.round(Number(v) || 5)));
  document.querySelectorAll('[data-reviews]').forEach(el => {
    const lim = el.dataset.reviews === 'all' ? list.length : parseInt(el.dataset.reviews, 10);
    const items = list.slice(0, lim);
    const section = el.closest('section');
    if (!items.length) {
      el.hidden = true;
      if (el.hasAttribute('data-hide-section') && section) section.hidden = true;
      return;
    }
    el.innerHTML = items.map(r => {
      const n = clamp(r.rating);
      return '<figure class="review"><div class="r-stars" role="img" aria-label="' + n + ' out of 5 stars">' + stars(n) + '</div>' +
        '<blockquote>' + esc(r.text) + '</blockquote>' +
        '<figcaption><b>' + esc(r.name) + '</b>' + (r.date ? '<span>' + esc(r.date) + '</span>' : '') + '<em>Google review</em></figcaption></figure>';
    }).join('');
    el.hidden = false;
    if (section) section.hidden = false;
  });
  const score = document.getElementById('ratingScore');
  if (score && meta.rating) {
    document.getElementById('ratingNum').textContent = Number(meta.rating).toFixed(1);
    document.getElementById('ratingStars').textContent = stars(clamp(meta.rating));
    document.getElementById('ratingCount').textContent = meta.count ? 'Based on ' + meta.count + ' Google reviews' : 'Google rating';
    score.hidden = false;
  }
}
renderReviews();

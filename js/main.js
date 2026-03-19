// ============================================
// SOE Website — Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initGlossaryFilter();
  initGlossarySearch();
  initNewsletterForm();
  initFadeIn();
  setActiveNavLink();
});

// --- Mobile Navigation ---
function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', links.classList.contains('open'));
  });

  // Close menu when clicking a link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
}

// --- Set Active Nav Link ---
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (path.endsWith(href) || (href === 'index.html' && (path === '/' || path.endsWith('/')))) {
      link.classList.add('active');
    }
  });
}

// --- Glossary Category Filter ---
function initGlossaryFilter() {
  const buttons = document.querySelectorAll('.glossary__filter-btn');
  const cards = document.querySelectorAll('.glossary-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.3s ease-in';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --- Glossary Search ---
function initGlossarySearch() {
  const input = document.querySelector('.glossary__input');
  const cards = document.querySelectorAll('.glossary-card');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    // Reset category filter
    document.querySelectorAll('.glossary__filter-btn').forEach(b => b.classList.remove('active'));
    const allBtn = document.querySelector('.glossary__filter-btn[data-category="all"]');
    if (allBtn) allBtn.classList.add('active');

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

// --- Newsletter Form ---
function initNewsletterForm() {
  const form = document.querySelector('.newsletter__form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter__input');
    const btn = form.querySelector('.newsletter__btn');

    if (input.value.includes('@')) {
      btn.textContent = 'You\'re in! 🍋';
      btn.style.background = 'var(--accent-teal)';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 3000);
    }
  });
}

// --- Fade In on Scroll ---
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.blog-card, .glossary-card, .section__header').forEach(el => {
    observer.observe(el);
  });
}

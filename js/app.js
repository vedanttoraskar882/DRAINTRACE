/**
 * DrainTrace - Frontend Prototype & Demo Application
 * Handles:
 * 1. Pilot Request form submissions with browser localStorage persistence
 *    - Key: "draintrace_pilot_requests"
 *    - Append to array of objects
 *    - Success state: "Thank you. Your pilot request has been submitted."
 * 2. Mobile drawer menu & navigation scroll spy
 * 3. Hero interactive view toggle (Estate vs Mobile Capture)
 * 4. FAQ Accordion interaction
 * 5. Animated number counter for UK food-service statistics
 * 6. LocalStorage Inspector Modal for testing & review
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroViewSwitcher();
  initStatsCounter();
  initFaqAccordion();
  initPilotForm();
  initStorageInspector();
  initFooterYear();
});

/* ==========================================================================
   1. NAVIGATION & HEADER
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('site-header');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Header background on scroll
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle & close
  const mobileCloseBtn = document.getElementById('mobile-drawer-close');

  const closeDrawer = () => {
    if (mobileBtn) mobileBtn.classList.remove('open');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    if (mobileDrawer) mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const openDrawer = () => {
    if (mobileBtn) mobileBtn.classList.add('open');
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'true');
    if (mobileDrawer) mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', closeDrawer);
    }

    // Close mobile menu when any nav link or CTA is clicked
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Active navigation highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));
}

/* ==========================================================================
   2. HERO SAAS DASHBOARD VIEW SWITCHER
   ========================================================================== */
function initHeroViewSwitcher() {
  const estateBtn = document.getElementById('btn-view-estate');
  const mobileBtn = document.getElementById('btn-view-mobile');
  const estateView = document.getElementById('estate-view');
  const mobileView = document.getElementById('mobile-view');

  if (!estateBtn || !mobileBtn || !estateView || !mobileView) return;

  estateBtn.addEventListener('click', () => {
    estateBtn.classList.add('active');
    mobileBtn.classList.remove('active');
    estateView.classList.add('active');
    mobileView.classList.remove('active');
  });

  mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.add('active');
    estateBtn.classList.remove('active');
    mobileView.classList.add('active');
    estateView.classList.remove('active');
  });
}

/* ==========================================================================
   3. ANIMATED STATISTICS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const counterElement = document.querySelector('.counter[data-target]');
  if (!counterElement) return;

  const target = parseInt(counterElement.getAttribute('data-target'), 10) || 360000;
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateNumber(counterElement, 0, target, 2000);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(counterElement);

  function animateNumber(el, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(start + (end - start) * easeProgress);

      el.textContent = currentVal.toLocaleString('en-GB');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = end.toLocaleString('en-GB');
      }
    }

    requestAnimationFrame(update);
  }
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerCollapse = item.querySelector('.faq-answer-collapse');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherCollapse = otherItem.querySelector('.faq-answer-collapse');
          otherBtn.setAttribute('aria-expanded', 'false');
          otherCollapse.style.maxHeight = null;
        }
      });

      // Toggle clicked item
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answerCollapse.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerCollapse.style.maxHeight = answerCollapse.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   5. REQUEST A PILOT FORM (LOCAL STORAGE IMPLEMENTATION)
   ========================================================================== */
const STORAGE_KEY = 'draintrace_pilot_requests';

function initPilotForm() {
  const form = document.getElementById('pilot-request-form');
  const successBanner = document.getElementById('form-success-banner');
  const submitAnotherBtn = document.getElementById('btn-submit-another');
  const countBadge = document.getElementById('submissions-count');

  updateSubmissionsCount();

  if (!form) return;

  // Handle plan CTA clicks from pricing section
  document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const planName = btn.getAttribute('data-plan');
      const orgInput = document.getElementById('organisationName');
      if (orgInput && !orgInput.value) {
        orgInput.placeholder = `e.g. Acme Dining (${planName} Plan Candidate)`;
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validation
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('email');
    const orgInput = document.getElementById('organisationName');

    const isValid = validatePilotInputs(fullNameInput, phoneInput, emailInput, orgInput);
    if (!isValid) return;

    // ISO timestamp and formatted UK time string
    const now = new Date();
    const submissionDateTime = now.toISOString();

    const newSubmission = {
      fullName: fullNameInput.value.trim(),
      phoneNumber: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      organisationName: orgInput.value.trim(),
      submissionDateTime: submissionDateTime
    };

    // Retrieve previous submissions array without overwriting
    let submissions = [];
    try {
      const rawStored = localStorage.getItem(STORAGE_KEY);
      if (rawStored) {
        const parsed = JSON.parse(rawStored);
        if (Array.isArray(parsed)) {
          submissions = parsed;
        }
      }
    } catch (err) {
      console.warn('DrainTrace: localStorage parse error, initializing empty array', err);
      submissions = [];
    }

    // Append new submission object
    submissions.push(newSubmission);

    // Save back to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch (storageErr) {
      console.error('Failed to save to localStorage:', storageErr);
      showToast('Local storage is full or restricted.');
      return;
    }

    // Update UI
    updateSubmissionsCount();

    // Display formatted time on success card
    const timeDisplay = document.getElementById('success-meta-time');
    if (timeDisplay) {
      timeDisplay.textContent = `Recorded: ${now.toLocaleDateString('en-GB')} at ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Hide form, show success message
    form.classList.add('hidden');
    successBanner.classList.add('visible');

    showToast('Pilot request recorded in localStorage!');
  });

  // Submit another request button
  if (submitAnotherBtn) {
    submitAnotherBtn.addEventListener('click', () => {
      form.reset();
      clearValidationErrors();
      form.classList.remove('hidden');
      successBanner.classList.remove('visible');
    });
  }
}

function validatePilotInputs(nameEl, phoneEl, emailEl, orgEl) {
  let valid = true;
  clearValidationErrors();

  if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
    showError(nameEl, 'fullName-error');
    valid = false;
  }

  // Basic UK / international phone check
  const phoneVal = phoneEl.value.trim().replace(/[\s()-]/g, '');
  if (!phoneVal || phoneVal.length < 7 || !/^\+?[0-9]{7,15}$/.test(phoneVal)) {
    showError(phoneEl, 'phoneNumber-error');
    valid = false;
  }

  // Basic RFC-5322 email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailEl.value.trim() || !emailRegex.test(emailEl.value.trim())) {
    showError(emailEl, 'email-error');
    valid = false;
  }

  if (!orgEl.value.trim() || orgEl.value.trim().length < 2) {
    showError(orgEl, 'organisationName-error');
    valid = false;
  }

  return valid;
}

function showError(inputEl, errorId) {
  inputEl.classList.add('invalid');
  const errEl = document.getElementById(errorId);
  if (errEl) {
    errEl.classList.add('visible');
  }
}

function clearValidationErrors() {
  document.querySelectorAll('.form-input').forEach(inp => inp.classList.remove('invalid'));
  document.querySelectorAll('.error-msg').forEach(msg => msg.classList.remove('visible'));
}

function updateSubmissionsCount() {
  const countBadge = document.getElementById('submissions-count');
  if (!countBadge) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    countBadge.textContent = Array.isArray(list) ? list.length : 0;
  } catch (e) {
    countBadge.textContent = 0;
  }
}

/* ==========================================================================
   6. LOCALSTORAGE INSPECTOR MODAL (FOR TESTING & REVIEW)
   ========================================================================== */
function initStorageInspector() {
  const inspectBtn = document.getElementById('btn-inspect-storage');
  const modal = document.getElementById('storage-modal');
  const closeBtn = document.getElementById('btn-close-modal');
  const doneBtn = document.getElementById('btn-modal-done');
  const clearBtn = document.getElementById('btn-clear-storage');
  const container = document.getElementById('modal-submissions-container');

  if (!inspectBtn || !modal || !container) return;

  const openModal = () => {
    renderStorageList(container);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  inspectBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

  // Click outside modal backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all pilot submissions stored in this browser?')) {
        localStorage.removeItem(STORAGE_KEY);
        updateSubmissionsCount();
        renderStorageList(container);
        showToast('Submissions cleared from localStorage.');
      }
    });
  }
}

function renderStorageList(container) {
  let list = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) list = JSON.parse(raw);
  } catch (e) {
    list = [];
  }

  if (!Array.isArray(list) || list.length === 0) {
    container.innerHTML = `
      <div class="no-submissions-msg">
        <p>No pilot submissions recorded in <code>localStorage['draintrace_pilot_requests']</code> yet.</p>
        <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #94A3B8;">Fill in and submit the "Request a Pilot" form on this page to test data persistence.</p>
      </div>
    `;
    return;
  }

  let html = '';
  list.forEach((sub, idx) => {
    const dateFormatted = sub.submissionDateTime ? new Date(sub.submissionDateTime).toLocaleString('en-GB') : 'Unknown';
    html += `
      <div class="submission-record-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="record-num">Submission #${idx + 1}</span>
          <span style="font-size: 0.725rem; color: #94A3B8;">${dateFormatted}</span>
        </div>
        <div class="record-grid">
          <div>
            <span class="record-field-label">Full Name:</span>
            <span class="record-field-val">${escapeHtml(sub.fullName || '—')}</span>
          </div>
          <div>
            <span class="record-field-label">Organisation:</span>
            <span class="record-field-val">${escapeHtml(sub.organisationName || '—')}</span>
          </div>
          <div>
            <span class="record-field-label">Email:</span>
            <span class="record-field-val">${escapeHtml(sub.email || '—')}</span>
          </div>
          <div>
            <span class="record-field-label">Phone:</span>
            <span class="record-field-val">${escapeHtml(sub.phoneNumber || '—')}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ==========================================================================
   7. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

/* ==========================================================================
   8. FOOTER DYNAMIC YEAR
   ========================================================================== */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

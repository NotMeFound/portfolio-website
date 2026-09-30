// In production with a separate backend service (e.g. Render/Railway), set your URL:
// const API_BASE = 'https://karan-portfolio-api.onrender.com';
// In local dev with Live Server (port 5500) and backend on port 5000, or in dev preview:
const API_BASE = window.API_BASE_URL || (
  window.location.hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== '5000' && window.location.port !== ''
    ? 'http://localhost:5000'
    : ''
);

(() => {
  'use strict';

  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !statusEl || !submitBtn) return;

  const emailRegex = /^\S+@\S+\.\S+$/;

  const fieldDefinitions = {
    name: {
      input: form.querySelector('#name'),
      isValid: (val) => val.trim().length >= 2,
      errorMsg: 'Please enter your name (minimum 2 characters).'
    },
    email: {
      input: form.querySelector('#email'),
      isValid: (val) => emailRegex.test(val.trim()),
      errorMsg: 'Please provide a valid email address.'
    },
    subject: {
      input: form.querySelector('#subject'),
      isValid: (val) => val.trim().length >= 2,
      errorMsg: 'Please enter a subject (minimum 2 characters).'
    },
    message: {
      input: form.querySelector('#message'),
      isValid: (val) => val.trim().length >= 5,
      errorMsg: 'Please enter your message (minimum 5 characters).'
    }
  };

  /**
   * Validates a single field and updates its visual cues (red/green borders).
   * @param {string} fieldKey - Key in fieldDefinitions
   * @param {boolean} forceCheck - If true, evaluates even if field is empty
   * @returns {boolean} Whether the field passes criteria
   */
  function validateField(fieldKey, forceCheck = false) {
    const field = fieldDefinitions[fieldKey];
    if (!field || !field.input) return false;

    const value = field.input.value;
    const isBlank = value.trim() === '';

    // If untouched and empty, keep normal neutral border
    if (!forceCheck && isBlank) {
      field.input.classList.remove('is-valid', 'is-invalid');
      return false;
    }

    const passes = field.isValid(value);

    if (passes) {
      field.input.classList.remove('is-invalid');
      field.input.classList.add('is-valid');
    } else {
      field.input.classList.remove('is-valid');
      field.input.classList.add('is-invalid');
    }

    return passes;
  }

  // Bind real-time input and blur events to all form fields
  Object.keys(fieldDefinitions).forEach((key) => {
    const el = fieldDefinitions[key].input;
    if (!el) return;

    el.addEventListener('input', () => {
      // Real-time visual cue as user types
      validateField(key, el.value.trim().length > 0);
      // Clear general error banner once user starts typing corrections
      if (statusEl.classList.contains('error')) {
        statusEl.className = 'form-status';
        statusEl.textContent = '';
      }
    });

    el.addEventListener('blur', () => {
      // On blur, validate if user has entered anything or left it blank
      validateField(key, true);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    statusEl.className = 'form-status';
    statusEl.textContent = '';

    // Validate all fields on submit
    let allValid = true;
    let firstInvalid = null;
    let firstErrorMessage = '';

    Object.keys(fieldDefinitions).forEach((key) => {
      const passes = validateField(key, true);
      if (!passes) {
        allValid = false;
        if (!firstInvalid) {
          firstInvalid = fieldDefinitions[key].input;
          firstErrorMessage = fieldDefinitions[key].errorMsg;
        }
      }
    });

    if (!allValid) {
      statusEl.className = 'form-status error';
      statusEl.textContent = firstErrorMessage || 'Please correct the highlighted fields.';
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    const name = fieldDefinitions.name.input.value.trim();
    const email = fieldDefinitions.email.input.value.trim();
    const subject = fieldDefinitions.subject.input.value.trim();
    const message = fieldDefinitions.message.input.value.trim();

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok) {
        statusEl.className = 'form-status ok';
        statusEl.textContent = "Message sent. Thank you — I'll reply soon.";
        form.reset();

        // Clear all validation states after successful reset
        Object.keys(fieldDefinitions).forEach((key) => {
          if (fieldDefinitions[key].input) {
            fieldDefinitions[key].input.classList.remove('is-valid', 'is-invalid');
          }
        });
      } else {
        statusEl.className = 'form-status error';
        statusEl.textContent = data.error || 'Something went wrong. Please try again.';
      }
    } catch (err) {
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Network error: could not connect to server. Please email directly.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
})();

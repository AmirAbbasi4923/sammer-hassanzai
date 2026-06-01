/* ===================================
   SAMEER HASSAN ZAI GYM — SCRIPT.JS
   Pure Vanilla JS — No Libraries
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. LOADING SCREEN
  // ==========================================
  const loadingScreen = document.getElementById('loading-screen');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 1800);
  });

  // Fallback: hide loader after 3s even if load event fires early
  setTimeout(() => {
    if (!loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }, 3000);

  // ==========================================
  // 2. SCROLL PROGRESS BAR
  // ==========================================
  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }

  // ==========================================
  // 3. NAVBAR SCROLL EFFECT
  // ==========================================
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ==========================================
  // 4. HAMBURGER MENU
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : 'auto';
  });

  navOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  // ==========================================
  // 5. ACTIVE NAV LINK HIGHLIGHT
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = navLinks.querySelectorAll('a');

  function highlightActiveSection() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(link => link.classList.remove('active'));
        const activeLink = navLinks.querySelector(`a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  // ==========================================
  // 6. SCROLL FADE-IN ANIMATIONS
  // ==========================================
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ==========================================
  // 7. STATS COUNT-UP ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateCountUp(element, target, suffix = '') {
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      
      element.innerHTML = current + `<span class="plus">${suffix}</span>`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  const statsSection = document.getElementById('stats');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(num => {
          const target = parseInt(num.dataset.target);
          const suffix = num.dataset.suffix || '';
          animateCountUp(num, target, suffix);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) statsObserver.observe(statsSection);

  // ==========================================
  // 8. BACK TO TOP BUTTON
  // ==========================================
  const backToTop = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // 9. COMBINED SCROLL HANDLER
  // ==========================================
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        handleNavbarScroll();
        highlightActiveSection();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial calls
  updateScrollProgress();
  handleNavbarScroll();
  handleBackToTop();

  // ==========================================
  // 10. BMI CALCULATOR
  // ==========================================
  const bmiForm = document.getElementById('bmi-form');
  const bmiResult = document.getElementById('bmi-result');
  const bmiValue = document.getElementById('bmi-value');
  const bmiCategory = document.getElementById('bmi-category');
  const bmiTip = document.getElementById('bmi-tip');

  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const height = parseFloat(document.getElementById('bmi-height').value);
      const weight = parseFloat(document.getElementById('bmi-weight').value);
      
      if (!height || !weight || height <= 0 || weight <= 0) {
        return;
      }
      
      // BMI = weight (kg) / height (m)²
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      const bmiRounded = bmi.toFixed(1);
      
      bmiValue.textContent = bmiRounded;
      
      let category = '';
      let categoryClass = '';
      let tip = '';
      
      if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'underweight';
        tip = '💡 Consider a nutrient-rich diet with more calories and protein. Consult our trainers for a mass-gaining program!';
        bmiValue.style.color = '#3498db';
      } else if (bmi < 25) {
        category = 'Normal';
        categoryClass = 'normal';
        tip = '🎉 Great job! You\'re in a healthy range. Keep up the good work with regular exercise and balanced nutrition!';
        bmiValue.style.color = '#2ecc71';
      } else if (bmi < 30) {
        category = 'Overweight';
        categoryClass = 'overweight';
        tip = '⚡ Time to take action! Our trainers can create a personalized workout plan. Cardio + strength training is your best bet!';
        bmiValue.style.color = '#f39c12';
      } else {
        category = 'Obese';
        categoryClass = 'obese';
        tip = '🏋️ Don\'t worry — every journey starts with a single step. Join our guided training programs to transform your fitness!';
        bmiValue.style.color = '#e74c3c';
      }
      
      bmiCategory.textContent = category;
      bmiCategory.className = 'bmi-category ' + categoryClass;
      bmiTip.textContent = tip;
      bmiResult.classList.add('show');
    });
  }

  // ==========================================
  // 11. TIMING TABS
  // ==========================================
  const timingTabs = document.querySelectorAll('.timing-tab');
  const timingPanels = document.querySelectorAll('.timing-panel');

  timingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      
      timingTabs.forEach(t => {
        t.classList.remove('active');
        t.style.borderBottom = '3px solid transparent';
        t.style.color = '#777';
      });
      
      tab.classList.add('active');
      tab.style.borderBottom = '3px solid var(--primary-color)';
      tab.style.color = 'inherit';
      
      timingPanels.forEach(panel => {
        if (panel.id === target) {
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 12. REGISTRATION FORM VALIDATION
  // ==========================================
  const regForm = document.getElementById('reg-form');
  const formSuccess = document.getElementById('form-success');

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Full Name
      const name = document.getElementById('reg-name');
      const nameError = document.getElementById('reg-name-error');
      if (!name.value.trim() || name.value.trim().length < 3) {
        name.classList.add('error');
        nameError.classList.add('show');
        isValid = false;
      } else {
        name.classList.remove('error');
        nameError.classList.remove('show');
      }
      
      // Phone
      const phone = document.getElementById('reg-phone');
      const phoneError = document.getElementById('reg-phone-error');
      const phoneRegex = /^\d{11}$/;
      if (!phoneRegex.test(phone.value.trim())) {
        phone.classList.add('error');
        phoneError.classList.add('show');
        isValid = false;
      } else {
        phone.classList.remove('error');
        phoneError.classList.remove('show');
      }
      
      // Gender
      const gender = document.querySelector('input[name="gender"]:checked');
      const genderError = document.getElementById('reg-gender-error');
      if (!gender) {
        genderError.classList.add('show');
        isValid = false;
      } else {
        genderError.classList.remove('show');
      }
      
      // Membership Plan
      const plan = document.getElementById('reg-plan');
      const planError = document.getElementById('reg-plan-error');
      if (!plan.value) {
        plan.classList.add('error');
        planError.classList.add('show');
        isValid = false;
      } else {
        plan.classList.remove('error');
        planError.classList.remove('show');
      }
      
      if (isValid) {
        const submitBtn = regForm.querySelector('.submit-btn');
        const errorMsg = document.getElementById('reg-error-msg');
        
        // Hide previous error if any
        if (errorMsg) errorMsg.style.display = 'none';
        
        // Set loading state on submit button
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';

        const nameVal = name.value.trim();
        const phoneVal = phone.value.trim();
        const genderVal = gender.value;
        const planVal = plan.options[plan.selectedIndex].text;

        // EmailJS payload (underscore keys for template variables)
        const payload = {
          full_name:       nameVal,
          phone_number:    phoneVal,
          gender:          genderVal,
          membership_plan: planVal
        };

        // Google Sheets payload — MUST match Apps Script keys exactly (camelCase)
        // Apps Script reads: data.fullName, data.phoneNumber, data.gender, data.membershipPlan
        const sheetsPayload = JSON.stringify({
          fullName:       nameVal,
          phoneNumber:    phoneVal,
          gender:         genderVal,
          membershipPlan: planVal
        });

        const sheetsUrl = 'https://script.google.com/macros/s/AKfycbzVzDWH8uLm-AZN4q7v3OBQMXVdmvwAZ4LTliBe0zwPvq_fxPtFflgplZ5ktmJAktvG/exec';

        Promise.all([
          // 1. EmailJS Send
          emailjs.send("service_3lb21eo", "template_b1za7ml", payload, "q9DMctBBAq9RoqV0d"),

          // 2. Google Sheets — POST with text/plain content-type
          // text/plain avoids CORS preflight (a "simple request") but the body
          // is still valid JSON that Apps Script reads via e.postData.contents
          fetch(sheetsUrl, {
            method:  'POST',
            mode:    'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body:    sheetsPayload
          })
        ])
        .then(() => {
          // Success behavior: clear form, hide form, show success message
          regForm.reset();
          regForm.style.display = 'none';
          formSuccess.classList.add('show');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch((err) => {
          console.error('Submission failed:', err);
          
          // Restore button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
          
          // Show detailed error message for troubleshooting
          if (errorMsg) {
            errorMsg.style.display = 'block';
            let errMsgDetail = "Failed to submit registration. Please try again.";
            if (err) {
              if (err.text) {
                errMsgDetail = `EmailJS Error: ${err.text}`;
              } else if (err.message) {
                errMsgDetail = `Error: ${err.message}`;
              } else {
                errMsgDetail = `Error: ${typeof err === 'string' ? err : JSON.stringify(err)}`;
              }
            }
            errorMsg.innerHTML = `❌ ${errMsgDetail}`;
            errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }
    });

    // Real-time validation reset
    const regInputs = regForm.querySelectorAll('input, select');
    regInputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.classList.remove('show');
      });
    });
  }

  // ==========================================
  // 13. HERO PARTICLES
  // ==========================================
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('hero-particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 8 + 5) + 's';
      particle.style.animationDelay = (Math.random() * 5) + 's';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      particleContainer.appendChild(particle);
    }
  }

  // ==========================================
  // 14. SMOOTH SCROLL FOR CTA
  // ==========================================
  const ctaBtn = document.querySelector('.hero-cta');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(ctaBtn.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ==========================================
  // 15. THEME TOGGLE (LIGHT / DARK)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  // Check saved theme or preferred system theme
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  } else {
    // Default to dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ==========================================
  // 16. WHATSAPP POPUP MODAL & FORM SUBMISSION
  // ==========================================
  const whatsappBtn = document.getElementById('whatsapp-btn');
  const waPopup = document.getElementById('wa-popup');
  const waPopupOverlay = document.getElementById('wa-popup-overlay');
  const waPopupClose = document.getElementById('wa-popup-close');
  const waForm = document.getElementById('wa-form');

  function openWaPopup() {
    if (waPopup && waPopupOverlay) {
      waPopup.classList.add('active');
      waPopupOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent page scrolling under popup
    }
  }

  function closeWaPopup() {
    if (waPopup && waPopupOverlay) {
      waPopup.classList.remove('active');
      waPopupOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', openWaPopup);
  }

  if (waPopupClose) {
    waPopupClose.addEventListener('click', closeWaPopup);
  }

  if (waPopupOverlay) {
    waPopupOverlay.addEventListener('click', closeWaPopup);
  }

  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('wa-name').value.trim();
      const phone = document.getElementById('wa-phone').value.trim();
      const training = document.getElementById('wa-training').value;
      
      if (!name || !phone || !training) return;
      
      // Construct prefilled message for WhatsApp
      const messageText = `Hello Sameer Hassan Zai Gym! I would like to register/inquire about gym membership.

Details:
👤 Name: ${name}
📞 Phone: ${phone}
🏋️ Training: ${training}`;
      
      const encodedText = encodeURIComponent(messageText);
      const whatsappNumber = '923152419624'; // Updated phone number 0315-2419624 -> 923152419624
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
      
      // Open in new tab
      window.open(whatsappUrl, '_blank');
      
      // Reset form and close modal
      waForm.reset();
      closeWaPopup();
    });
  }

  // ==========================================
  // 17. CHAMPION PHOTO CAROUSELS
  // ==========================================
  const AUTOPLAY_MS = 3000;

  function setupAutoRetryChampionImage(img, carousel) {
    const baseSrc = img.getAttribute('src').split('?')[0];
    let retryTimer = null;

    function markMissing() {
      carousel.classList.add('photo-missing');
    }

    function markLoaded() {
      carousel.classList.remove('photo-missing');
      if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
    }

    img.addEventListener('load', markLoaded);
    img.addEventListener('error', () => {
      markMissing();
      if (retryTimer) return;
      retryTimer = setInterval(() => {
        const probe = new Image();
        probe.onload = () => {
          img.src = baseSrc + '?t=' + Date.now();
        };
        probe.onerror = () => {};
        probe.src = baseSrc + '?t=' + Date.now();
      }, 5000);
    });

    if (img.complete && img.naturalHeight > 0) {
      markLoaded();
    } else if (img.complete) {
      markMissing();
    }
  }

  function initChampionCarousels() {
    document.querySelectorAll('[data-champion-carousel]').forEach(card => {
      const carousel = card.querySelector('.champion-carousel');
      const track = card.querySelector('.carousel-track');
      const slides = card.querySelectorAll('.carousel-slide');
      const dotsContainer = card.querySelector('.carousel-dots');
      const prevBtn = card.querySelector('.carousel-prev');
      const nextBtn = card.querySelector('.carousel-next');
      const viewport = card.querySelector('.carousel-viewport');
      const autoRetryImg = card.querySelector('img[data-auto-retry]');

      if (!track || slides.length === 0) return;

      if (autoRetryImg) {
        setupAutoRetryChampionImage(autoRetryImg, carousel);
      }

      const isSingleSlide = slides.length === 1 || carousel.classList.contains('champion-carousel--single');
      if (isSingleSlide) {
        return;
      }

      let currentIndex = 0;
      let autoplayTimer = null;
      let resumeTimeout = null;
      let touchStartX = 0;
      let touchEndX = 0;

      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
        dot.setAttribute('role', 'tab');
        dot.addEventListener('click', () => {
          goToSlide(i);
          pauseAutoplay();
        });
        dotsContainer.appendChild(dot);
      });

      const dots = dotsContainer.querySelectorAll('.carousel-dot');

      function goToSlide(index) {
        const total = slides.length;
        currentIndex = ((index % total) + total) % total;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
      }

      function nextSlide() {
        goToSlide(currentIndex + 1);
      }

      function prevSlide() {
        goToSlide(currentIndex - 1);
      }

      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
      }

      function stopAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }

      function pauseAutoplay() {
        stopAutoplay();
        carousel.classList.add('is-paused');
        if (resumeTimeout) {
          clearTimeout(resumeTimeout);
          resumeTimeout = null;
        }
      }

      function resumeAutoplay() {
        carousel.classList.remove('is-paused');
        startAutoplay();
      }

      function scheduleResumeAutoplay(delay = 4000) {
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
          resumeAutoplay();
          resumeTimeout = null;
        }, delay);
      }

      prevBtn.addEventListener('click', () => {
        prevSlide();
        pauseAutoplay();
      });

      nextBtn.addEventListener('click', () => {
        nextSlide();
        pauseAutoplay();
      });

      card.addEventListener('mouseenter', pauseAutoplay);
      card.addEventListener('mouseleave', resumeAutoplay);

      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pauseAutoplay();
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        if (Math.abs(diff) > threshold) {
          if (diff > 0) nextSlide();
          else prevSlide();
        }
        scheduleResumeAutoplay();
      }, { passive: true });

      startAutoplay();
    });
  }

  initChampionCarousels();

  // ==========================================
  // 18. DRAGGABLE WHATSAPP BUTTON
  // ==========================================
  if (whatsappBtn) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let dragThreshold = 5;
    let moved = false;

    whatsappBtn.style.cursor = 'grab';

    whatsappBtn.addEventListener('mousedown', dragStart);
    whatsappBtn.addEventListener('touchstart', dragStart, { passive: true });

    function dragStart(e) {
      if (e.type === "touchstart") {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else {
        startX = e.clientX;
        startY = e.clientY;
      }

      const rect = whatsappBtn.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      moved = false;
      whatsappBtn.style.cursor = 'grabbing';
      whatsappBtn.style.transition = 'none'; // disable hover transitions while dragging

      document.addEventListener('mousemove', dragging);
      document.addEventListener('touchmove', dragging, { passive: false });
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchend', dragEnd);
    }

    function dragging(e) {
      let currentX, currentY;

      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
      } else {
        currentX = e.clientX;
        currentY = e.clientY;
      }

      let diffX = currentX - startX;
      let diffY = currentY - startY;

      if (!moved && (Math.abs(diffX) > dragThreshold || Math.abs(diffY) > dragThreshold)) {
        moved = true;
        isDragging = true;
      }

      if (moved) {
        if(e.cancelable) e.preventDefault();
        whatsappBtn.style.left = (initialX + diffX) + 'px';
        whatsappBtn.style.top = (initialY + diffY) + 'px';
        whatsappBtn.style.bottom = 'auto';
        whatsappBtn.style.right = 'auto';
      }
    }

    function dragEnd(e) {
      document.removeEventListener('mousemove', dragging);
      document.removeEventListener('touchmove', dragging);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchend', dragEnd);
      
      whatsappBtn.style.cursor = 'grab';
      whatsappBtn.style.transition = ''; // restore transitions
      
      setTimeout(() => {
        isDragging = false;
      }, 50);
    }

    // Intercept click to prevent popup if dragging
    whatsappBtn.addEventListener('click', (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

});

/* ============================================================
     GSAP SETUP
  ============================================================ */
  gsap.registerPlugin(ScrollTrigger);

  /* ============================================================
     HERO ANIMATIONS — staggered entrance on page load
  ============================================================ */
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .to('#heroBadge',      { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
    .to('#heroTitle',      { opacity: 1, y: 0, duration: 1.0 }, '-=0.4')
    .to('#heroTagline',    { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    .to('#heroActions',    { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('#heroStats',      { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    .to('#scrollIndicator',{ opacity: 1, y: 0, duration: 0.6 }, '-=0.3');

  /* ============================================================
     PARALLAX HERO BACKGROUND on scroll
  ============================================================ */
  gsap.to('#heroBg', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  /* ============================================================
     NAVIGATION — scroll state
  ============================================================ */
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      nav.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     MOBILE MENU
  ============================================================ */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  mobileClose.addEventListener('click', closeMobile);

  function closeMobile() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ============================================================
     SCROLL-TRIGGERED SECTION REVEALS
  ============================================================ */
  /* Generic .reveal elements */
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* Slide-in from left */
  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* Slide-in from right */
  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* ============================================================
     MENU CARDS — staggered reveal on scroll
  ============================================================ */
  gsap.utils.toArray('.menu-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      delay: (i % 3) * 0.12,
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* ============================================================
     GALLERY ITEMS — staggered fade-in
  ============================================================ */
  gsap.utils.toArray('.gallery-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      delay: i * 0.07,
      scrollTrigger: {
        trigger: '#gallery',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* ============================================================
     REVIEW CARDS — staggered reveal
  ============================================================ */
  gsap.utils.toArray('.review-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      delay: i * 0.10,
      scrollTrigger: {
        trigger: '#reviews',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* ============================================================
     MENU FILTER — category tabs
  ============================================================ */
  function filterMenu(cat) {
    // Update tab appearance
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    const cards = document.querySelectorAll('.menu-card');

    cards.forEach(card => {
      const show = (cat === 'all') || card.dataset.cat === cat;
      gsap.to(card, {
        opacity: show ? 1 : 0.2,
        scale: show ? 1 : 0.96,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  }

  /* ============================================================
     REVIEW SLIDER
  ============================================================ */
  (function initSlider() {
    const track  = document.getElementById('reviewsTrack');
    const cards  = track.querySelectorAll('.review-card');
    const dotsWrap = document.getElementById('sliderDots');
    const prevBtn  = document.getElementById('slidePrev');
    const nextBtn  = document.getElementById('slideNext');

    // How many cards visible at once?
    function visibleCount() {
      if (window.innerWidth <= 640)  return 1;
      if (window.innerWidth <= 900)  return 2;
      return 3;
    }

    let current = 0;
    const total = cards.length;

    // Build dots
    function buildDots() {
      dotsWrap.innerHTML = '';
      const maxIndex = total - visibleCount();
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', `Review ${i + 1}`);
        dot.onclick = () => goTo(i);
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(idx) {
      const max = total - visibleCount();
      current = Math.max(0, Math.min(idx, max));
      const cardW = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
      gsap.to(track, {
        x: -current * cardW,
        duration: 0.65,
        ease: 'power3.inOut'
      });
      // Update dots
      dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Rebuild on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        current = 0;
        gsap.set(track, { x: 0 });
        buildDots();
      }, 200);
    });

    // Drag / swipe support
    let startX = 0;
    track.addEventListener('pointerdown', e => { startX = e.clientX; });
    track.addEventListener('pointerup',   e => {
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });

    // Auto-advance every 5s
    let autoTimer = setInterval(() => goTo(current + 1 > total - visibleCount() ? 0 : current + 1), 5000);
    track.addEventListener('pointerdown', () => clearInterval(autoTimer));

    buildDots();
  })();

  /* ============================================================
     GALLERY LIGHTBOX
  ============================================================ */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxClose= document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      const alt = item.querySelector('img').alt;
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';

      gsap.fromTo(lightboxImg,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' }
      );
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    gsap.to(lightboxImg, {
      scale: 0.9, opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================================
     BUTTON HOVER MICRO-ANIMATIONS (GSAP)
  ============================================================ */
  document.querySelectorAll('.btn, .btn-card').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.04, duration: 0.2, ease: 'power1.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power1.out' });
    });
  });

  /* ============================================================
     NEWSLETTER BUTTON FEEDBACK
  ============================================================ */
  function subscribeNewsletter(btn) {
    const input = btn.previousElementSibling;
    if (!input.value || !input.value.includes('@')) {
      gsap.to(input, { x: [-6, 6, -5, 5, 0], duration: 0.4, ease: 'power1.inOut' });
      return;
    }
    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#2d6a4f';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
    }, 3000);
  }

  /* ============================================================
     NAV LINK SMOOTH SCROLL
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     PERFORMANCE: refresh ScrollTrigger after images load
  ============================================================ */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
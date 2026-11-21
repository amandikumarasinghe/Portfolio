/**
 * ============================================================================
 * CHARUKA AMANDI PORTFOLIO - MOTION ENGINE & INTERACTION ORCHESTRATOR
 * - Page load sequence (hero eyebrow, headline word masks, subtext, actions, yellow underline)
 * - Word-by-word staggered text reveal on 15% viewport intersection
 * - Smooth lerped parallax engine with clamped offsets & mobile attenuation
 * - Specific element entrances (slides, rotate-up, zoom-in, fade-blur)
 * - Scroll progress bar (Coral -> Gold -> Teal)
 * - Full prefers-reduced-motion compliance
 * ============================================================================
 */

(function () {
  'use strict';

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const desktopMenu = document.getElementById('navDesktopMenu');

  if (mobileToggle && desktopMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      desktopMenu.classList.toggle('active');
    });

    desktopMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        desktopMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Sticky navbar shadow on scroll
  const headerNav = document.getElementById('headerNav');
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (headerNav) {
      if (scrollY > 30) {
        headerNav.classList.add('scrolled');
      } else {
        headerNav.classList.remove('scrolled');
      }
    }

    // Scroll progress bar
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(Math.max((scrollY / docHeight) * 100, 0), 100);
        scrollProgressBar.style.width = `${progress}%`;
      }
    }
  }, { passive: true });

  // If reduced motion is preferred, reveal all elements immediately and bypass motion loops
  if (prefersReducedMotion) {
    const preloader = document.getElementById('preloaderOverlay');
    if (preloader) preloader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');

    document.querySelectorAll('.anim-from-right, .anim-from-left, .anim-rotate-up, .anim-zoom-in, .anim-fade-blur').forEach(el => {
      el.classList.add('is-active');
    });
    const yellowLine = document.getElementById('yellowUnderline');
    if (yellowLine) yellowLine.classList.add('is-drawn');
    // Immediate count for stats
    document.querySelectorAll('.stat-counter').forEach(c => {
      c.textContent = (c.getAttribute('data-target') || '0') + (c.getAttribute('data-suffix') || '');
    });
    return;
  }

  // ==========================================================================
  // PRELOADER / INTRO LANDING ANIMATION
  // ==========================================================================
  function setupPreloader(onComplete) {
    document.body.classList.add('is-loading');
    const preloader = document.getElementById('preloaderOverlay');
    const barFill = document.getElementById('preloaderBarFill');

    if (!preloader || !barFill) {
      if (onComplete) onComplete();
      return;
    }

    // Stepwise organic progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        barFill.style.width = '100%';

        setTimeout(() => {
          preloader.classList.add('is-hidden');
          document.body.classList.remove('is-loading');
          if (onComplete) onComplete();
        }, 350);
      } else {
        barFill.style.width = `${progress}%`;
      }
    }, 90);
  }

  // ==========================================================================
  // 1. PAGE LOAD SEQUENCE
  // Hero eyebrow -> headline words rise from mask with slight rotation (90ms stagger)
  // -> subtext -> buttons -> yellow script underline draws left-to-right
  // ==========================================================================
  function setupPageLoadSequence() {
    const eyebrow = document.getElementById('heroEyebrow');
    const headline = document.getElementById('heroHeadline');
    const subtext = document.getElementById('heroSubtext');
    const actions = document.getElementById('heroActions');
    const photoWrap = document.getElementById('heroPhotoWrap');
    const yellowUnderline = document.getElementById('yellowUnderline');

    // Split headline nodes while preserving the underline span
    if (headline) {
      const childNodes = Array.from(headline.childNodes);
      headline.innerHTML = '';

      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/(\s+)/);
          words.forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) {
              headline.appendChild(document.createTextNode(w));
            } else {
              const mask = document.createElement('span');
              mask.className = 'word-mask';
              const inner = document.createElement('span');
              inner.className = 'word-inner hero-word';
              inner.textContent = w;
              mask.appendChild(inner);
              headline.appendChild(mask);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.toLowerCase() === 'br') {
            headline.appendChild(document.createElement('br'));
          } else {
            // For the script wrapper (.underline-wrapper)
            const mask = document.createElement('span');
            mask.className = 'word-mask';
            mask.style.overflow = 'visible'; // allow yellow underline to overflow
            node.classList.add('word-inner', 'hero-word');
            mask.appendChild(node);
            headline.appendChild(mask);
          }
        }
      });
    }

    // Sequence timing
    // Step 1: Initial state
    if (eyebrow) {
      eyebrow.style.opacity = '0';
      eyebrow.style.transform = 'translateY(20px)';
      eyebrow.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
    }
    if (subtext) {
      subtext.style.opacity = '0';
      subtext.style.transform = 'translateY(20px)';
      subtext.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
    }
    if (actions) {
      actions.style.opacity = '0';
      actions.style.transform = 'translateY(20px)';
      actions.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
    }

    // Trigger sequential reveal
    setTimeout(() => {
      // 1. Eyebrow
      if (eyebrow) {
        eyebrow.style.opacity = '1';
        eyebrow.style.transform = 'translateY(0)';
      }

      // 2. Headline words 90ms apart
      const heroWords = document.querySelectorAll('.hero-word');
      let wordDelay = 150;
      heroWords.forEach((word) => {
        setTimeout(() => {
          word.classList.add('revealed');
        }, wordDelay);
        wordDelay += 90;
      });

      // 3. Hero photo entrance from right
      setTimeout(() => {
        if (photoWrap) photoWrap.classList.add('is-active');
      }, wordDelay - 100);

      // 4. Subtext reveal
      setTimeout(() => {
        if (subtext) {
          subtext.style.opacity = '1';
          subtext.style.transform = 'translateY(0)';
        }
      }, wordDelay + 100);

      // 5. Buttons reveal
      setTimeout(() => {
        if (actions) {
          actions.style.opacity = '1';
          actions.style.transform = 'translateY(0)';
        }
      }, wordDelay + 240);

      // 6. Yellow script underline draws left-to-right afterward
      setTimeout(() => {
        if (yellowUnderline) {
          yellowUnderline.classList.add('is-drawn');
        }
      }, wordDelay + 380);
    }, 180);
  }

  // ==========================================================================
  // 2. TEXT REVEAL: Word-by-word on 15% viewport intersection
  // Headings ~70-90ms stagger, body paragraphs ~20ms stagger. Triggered once.
  // ==========================================================================
  function splitTextIntoWords(element, isHeading) {
    const text = element.textContent.trim();
    if (!text) return [];
    const words = text.split(/\s+/);
    element.innerHTML = '';

    const wordSpans = [];
    words.forEach(w => {
      const mask = document.createElement('span');
      mask.className = 'word-mask';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = w;
      mask.appendChild(inner);
      element.appendChild(mask);
      element.appendChild(document.createTextNode(' '));
      wordSpans.push(inner);
    });

    return wordSpans;
  }

  function setupTextRevealObserver() {
    const textElements = document.querySelectorAll('.reveal-text');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          obs.unobserve(el);

          const isHeading = /^H[1-6]$/i.test(el.tagName);
          const staggerMs = isHeading ? 75 : 20;

          // If element contains special formatting like .script-accent, split child nodes carefully
          const wordSpans = [];
          Array.from(el.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              const words = node.textContent.split(/(\s+)/);
              const frag = document.createDocumentFragment();
              words.forEach(w => {
                if (!w) return;
                if (/^\s+$/.test(w)) {
                  frag.appendChild(document.createTextNode(w));
                } else {
                  const mask = document.createElement('span');
                  mask.className = 'word-mask';
                  const inner = document.createElement('span');
                  inner.className = 'word-inner';
                  inner.textContent = w;
                  mask.appendChild(inner);
                  frag.appendChild(mask);
                  wordSpans.push(inner);
                }
              });
              node.replaceWith(frag);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // Wrapped elements like <span class="script-accent">
              const mask = document.createElement('span');
              mask.className = 'word-mask';
              node.classList.add('word-inner');
              mask.appendChild(node.cloneNode(true));
              node.replaceWith(mask);
              wordSpans.push(mask.querySelector('.word-inner'));
            }
          });

          // Stagger reveal of words
          wordSpans.forEach((span, index) => {
            setTimeout(() => {
              if (span) span.classList.add('revealed');
            }, index * staggerMs);
          });
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    textElements.forEach(el => observer.observe(el));
  }

  // ==========================================================================
  // 3. ELEMENT ENTRANCES BY TYPE (IntersectionObserver)
  // - Hero photo: from right (handled in load sequence)
  // - About image: from left
  // - Project cards: rotate-up with 140ms stagger
  // - Service items: slide from left with 120ms stagger
  // - Stat tiles: zoom in & count up
  // - Testimonials: fade in from blur with 150ms stagger
  // - CTA card: slide from right
  // ==========================================================================
  function animateCounter(el) {
    const target = +el.getAttribute('data-target') || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function setupElementEntrances() {
    // 1. General Entrances (About, Projects, Services, Testimonials, CTA)
    const animTargets = document.querySelectorAll('.anim-from-right, .anim-from-left, .anim-rotate-up, .anim-zoom-in, .anim-fade-blur');

    const entranceObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          obs.unobserve(el);

          // Handle staggered siblings (e.g. project cards, service items, testimonials)
          let delay = 0;
          const parent = el.parentElement;

          if (el.classList.contains('anim-rotate-up') && parent) {
            const siblings = Array.from(parent.querySelectorAll('.anim-rotate-up'));
            const idx = siblings.indexOf(el);
            delay = (idx >= 0 ? idx : 0) * 140; // 140ms stagger for project cards
          } else if (el.classList.contains('service-item-card') && parent) {
            const siblings = Array.from(parent.querySelectorAll('.service-item-card'));
            const idx = siblings.indexOf(el);
            delay = (idx >= 0 ? idx : 0) * 110; // 110ms stagger for services
          } else if (el.classList.contains('testimonial-card-item') && parent) {
            const siblings = Array.from(parent.querySelectorAll('.testimonial-card-item'));
            const idx = siblings.indexOf(el);
            delay = (idx >= 0 ? idx : 0) * 150; // 150ms stagger for testimonials
          } else if (el.classList.contains('stat-tile-card') && parent) {
            const siblings = Array.from(parent.querySelectorAll('.stat-tile-card'));
            const idx = siblings.indexOf(el);
            delay = (idx >= 0 ? idx : 0) * 120;
          }

          setTimeout(() => {
            el.classList.add('is-active');

            // If it contains a stat counter, trigger counting
            const counter = el.querySelector('.stat-counter');
            if (counter) {
              animateCounter(counter);
            }
          }, delay);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    animTargets.forEach(el => {
      // Avoid re-observing the hero photo if already revealed
      if (el.id !== 'heroPhotoWrap') {
        entranceObserver.observe(el);
      }
    });
  }

  // ==========================================================================
  // 4. PARALLAX ENGINE (SMOOTH LERPED MOTION WITH CLAMPED OFFSETS)
  // - Each layer has its own speed
  // - Background blobs & sun: slow (0.1 - 0.3x)
  // - Foreground badge, sparkles, paper plane: drift ahead (-0.15 to -0.3x)
  // - Cards in same row move at slightly different speeds
  // - Skips off-screen parallax work for high performance
  // - Halves offset on mobile devices (<768px)
  // ==========================================================================
  function setupParallaxEngine() {
    const parallaxItems = Array.from(document.querySelectorAll('.data-parallax')).map(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
      return {
        element: el,
        speed: speed,
        currentY: 0,
        targetY: 0,
        rect: el.getBoundingClientRect()
      };
    });

    if (parallaxItems.length === 0) return;

    let targetScroll = window.scrollY;
    let currentScroll = targetScroll;
    let isRunning = false;

    // Viewport bounds helper
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.bottom >= -150 && rect.top <= vh + 150;
    }

    function renderParallax() {
      // Lerp current scroll toward target scroll for buttery smooth deceleration
      currentScroll += (targetScroll - currentScroll) * 0.1;

      const isMobile = window.innerWidth < 768;
      const mobileFactor = isMobile ? 0.5 : 1.0;
      const vh = window.innerHeight;

      parallaxItems.forEach(item => {
        // Skip off-screen parallax work
        if (!isElementInViewport(item.element)) return;

        const rect = item.element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const screenCenter = vh / 2;
        const distanceFromCenter = elementCenter - screenCenter;

        // Raw calculated parallax target
        let rawOffset = -distanceFromCenter * item.speed * mobileFactor;

        // Clamp offsets between -75px and +75px to maintain layout stability
        const clampedOffset = Math.max(-75, Math.min(75, rawOffset));

        // Smooth local lerp
        item.currentY += (clampedOffset - item.currentY) * 0.12;

        // Apply hardware-accelerated transform only
        item.element.style.transform = `translate3d(0, ${item.currentY.toFixed(2)}px, 0)`;
      });

      // Continue animation loop if still moving
      if (Math.abs(targetScroll - currentScroll) > 0.1) {
        requestAnimationFrame(renderParallax);
      } else {
        isRunning = false;
      }
    }

    window.addEventListener('scroll', () => {
      targetScroll = window.scrollY;
      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(renderParallax);
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      targetScroll = window.scrollY;
      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(renderParallax);
      }
    }, { passive: true });

    // Initial kickoff
    requestAnimationFrame(renderParallax);
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    setupPreloader(() => {
      setupPageLoadSequence();
      setupTextRevealObserver();
      setupElementEntrances();
      setupParallaxEngine();
    });
  });

})();

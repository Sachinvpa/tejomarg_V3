// ============================================================
// TEJOMARG FOUNDATION — Motion module
// Restrained, premium motion appropriate for an institutional
// foundation site. Nothing decorative for its own sake.
// ============================================================

(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  // 1. READING PROGRESS BAR (top of page, gradient orange)
  // ============================================================
  (function progressBar() {
    const bar = document.createElement('div');
    bar.id = 'tm-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<div class="tm-progress-fill"></div>';
    document.body.appendChild(bar);

    const fill = bar.querySelector('.tm-progress-fill');
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      fill.style.transform = `scaleX(${p})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  })();

  if (reduce) return;

  // ============================================================
  // 2. WORD-BY-WORD HEADLINE REVEAL (only the page hero h1)
  // ============================================================
  (function headlineReveal() {
    const targets = document.querySelectorAll('.hero h1, .page-hero h1, .initiatives-hero h1, .impact-hero h1, .about-hero h1, .contact-hero h1');
    targets.forEach(h => {
      // Recursive walk: split text nodes into word spans, but treat any
      // element with gradient text (.accent or anything inheriting
      // -webkit-text-fill-color: transparent) as a single atomic word.
      const walk = (node) => {
        const out = [];
        Array.from(node.childNodes).forEach(c => {
          if (c.nodeType === Node.TEXT_NODE) {
            const parts = c.textContent.split(/(\s+)/);
            parts.forEach(p => {
              if (!p) return;
              if (/^\s+$/.test(p)) {
                out.push(document.createTextNode(p));
              } else {
                const s = document.createElement('span');
                s.className = 'tm-word';
                s.textContent = p;
                out.push(s);
              }
            });
          } else if (c.nodeType === Node.ELEMENT_NODE) {
            // If this element uses gradient text, treat it as one unit.
            const cs = getComputedStyle(c);
            const isGradientText = cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)'
              || c.classList.contains('accent');
            if (isGradientText) {
              const s = document.createElement('span');
              s.className = 'tm-word';
              s.appendChild(c.cloneNode(true));
              out.push(s);
            } else {
              const wrapped = walk(c);
              c.innerHTML = '';
              wrapped.forEach(w => c.appendChild(w));
              out.push(c);
            }
          } else {
            out.push(c);
          }
        });
        return out;
      };
      const wrapped = walk(h);
      h.innerHTML = '';
      wrapped.forEach(w => h.appendChild(w));

      // Stagger their entrance
      const words = h.querySelectorAll('.tm-word');
      words.forEach((w, i) => {
        w.style.setProperty('--d', (i * 0.08) + 's');
      });
      // Trigger via IntersectionObserver so it plays when in view
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('tm-reveal-in');
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0.2 });
        io.observe(h);
      } else {
        h.classList.add('tm-reveal-in');
      }
    });
  })();

  // ============================================================
  // 3. MAGNETIC HOVER ON BUTTONS — disabled (no button movement)
  // ============================================================
  (function magneticButtons() {
    // Intentionally left inert: buttons should not shift on hover.
    return;
  })();

  // ============================================================
  // 4. SECTION PARALLAX (very subtle background drift on scroll)
  // ============================================================
  (function parallax() {
    // Apply to hero panels and feature dark cards so the orange glow
    // bleeds drift gently at a different rate than the content.
    const layers = document.querySelectorAll('.hero, .page-hero, .impact-hero, .about-hero, .contact-hero, .initiatives-hero, .featured, .feature-card');
    if (!layers.length) return;

    let ticking = false;
    const update = () => {
      const sy = window.scrollY;
      layers.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        // Drift the element's ::before background using a CSS var
        const offset = (r.top * 0.06).toFixed(1);
        el.style.setProperty('--tm-parallax', offset + 'px');
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  })();

  // ============================================================
  // 5. AMBIENT FLOATING DOTS in the dark hero panel
  // ============================================================
  (function ambientDots() {
    const panels = document.querySelectorAll('.hero-panel');
    panels.forEach(panel => {
      const layer = document.createElement('div');
      layer.className = 'tm-dots';
      layer.setAttribute('aria-hidden', 'true');
      const N = 6;
      for (let i = 0; i < N; i++) {
        const d = document.createElement('span');
        d.className = 'tm-dot';
        d.style.setProperty('--x', (10 + Math.random() * 80) + '%');
        d.style.setProperty('--y', (10 + Math.random() * 80) + '%');
        d.style.setProperty('--s', (1 + Math.random() * 2.2).toFixed(2) + 'px');
        d.style.setProperty('--del', (Math.random() * 4).toFixed(1) + 's');
        d.style.setProperty('--dur', (8 + Math.random() * 8).toFixed(1) + 's');
        d.style.setProperty('--amp', (10 + Math.random() * 18).toFixed(1) + 'px');
        layer.appendChild(d);
      }
      panel.appendChild(layer);
    });
  })();

})();

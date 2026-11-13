/**
 * IE12103 E-Commerce - Practical Activity 2
 * "Me, My Hometown and Interest"
 * Interactive UI Scripts & Live Cyber Particle Background
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFilters();
  initModals();
  initToasts();
  initLiveCyberBackground();
});

/* Mobile Menu Toggle */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      }
    });
  }
}

/* Category Filter Buttons (Used in Hometown & Hobbies) */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length === 0 || filterItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      filterItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCat === filterVal) {
          item.style.display = 'flex';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transition = 'opacity 0.3s ease';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* Modal Windows for Details / Fun Facts */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const closeBtns = document.querySelectorAll('.modal-close-btn, [data-modal-close]');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-overlay');
      if (parentModal) {
        parentModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on backdrop click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* Toast Notification Utility */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function initToasts() {
  const toastTriggers = document.querySelectorAll('[data-toast]');
  toastTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const msg = trigger.getAttribute('data-toast');
      showToast(msg);
    });
  });
}

/* Live Moving Cyber Particles & Constellation Background */
function initLiveCyberBackground() {
  let canvas = document.getElementById('cyberCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'cyberCanvas';
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(window.innerWidth < 768 ? 40 : 85, 100);
  const colors = [
    { r: 0, g: 242, b: 254 },    // Neon Cyan
    { r: 192, g: 132, b: 252 },  // Neon Purple
    { r: 236, g: 72, b: 153 },   // Neon Pink
    { r: 56, g: 189, b: 248 }    // Neon Blue
  ];

  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 2.2 + 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = -(Math.random() * 0.8 + 0.3); // Drift smoothly upwards
      this.alpha = Math.random() * 0.6 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseVal = Math.random() * Math.PI;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      this.pulseVal += this.pulseSpeed;
      this.currentAlpha = this.alpha * (0.6 + 0.4 * Math.sin(this.pulseVal));

      // Mouse gentle interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 2;
          this.y += Math.sin(angle) * force * 2;
        }
      }

      // Wrap around edges
      if (this.y < -10) this.y = height + 10;
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow
    }
  }

  // Populate particles
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw connecting cyber network lines
  function drawConnections() {
    const maxDist = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    drawConnections();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

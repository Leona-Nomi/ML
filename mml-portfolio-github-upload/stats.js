const cards = document.querySelectorAll('.reveal-card');
const numbers = document.querySelectorAll('.stat-number');

const animateNumber = (element) => {
  const target = Number(element.dataset.value);
  const suffix = element.dataset.suffix || '';
  const decimal = target % 1 !== 0;
  const duration = 1050;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    element.textContent = `${decimal ? current.toFixed(1) : Math.round(current)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver((entries, instance) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    const number = entry.target.querySelector('.stat-number');
    if (number && !number.dataset.animated) {
      number.dataset.animated = 'true';
      animateNumber(number);
    }
    instance.unobserve(entry.target);
  });
}, { threshold: .22 });

cards.forEach((card) => observer.observe(card));

cards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    card.style.transform = `perspective(900px) rotateX(${y * -2}deg) rotateY(${x * 2}deg) translateY(-8px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

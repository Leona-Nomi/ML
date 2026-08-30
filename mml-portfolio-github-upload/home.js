const glow = document.querySelector('.cursor-glow');
const hero = document.querySelector('.ml-hero');

window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
  glow.style.opacity = '0.14';
});

hero?.addEventListener('pointermove', (event) => {
  const bounds = hero.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  const frame = hero.querySelector('.portrait-frame');
  frame.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
});

hero?.addEventListener('pointerleave', () => {
  hero.querySelector('.portrait-frame').style.transform = '';
});

const timeline = document.querySelector('.experience-timeline');
const entries = [...document.querySelectorAll('.experience-entry')];
const progress = document.querySelector('.experience-line span');
let frame = 0;

const observer = new IntersectionObserver((observed) => {
  observed.forEach((item) => {
    if (item.isIntersecting) item.target.classList.add('is-active');
  });
}, { rootMargin: '-22% 0px -28%', threshold: .18 });

entries.forEach((entry) => observer.observe(entry));

const updateTimeline = () => {
  frame = 0;
  if (!timeline || !progress) return;
  const rect = timeline.getBoundingClientRect();
  const start = window.innerHeight * .52;
  const travelled = start - rect.top;
  const maximum = Math.max(1, rect.height - window.innerHeight * .38);
  const ratio = Math.min(1, Math.max(0, travelled / maximum));
  progress.style.transform = `scaleY(${ratio})`;
};

window.addEventListener('scroll', () => {
  if (!frame) frame = requestAnimationFrame(updateTimeline);
}, { passive: true });
window.addEventListener('resize', updateTimeline, { passive: true });
updateTimeline();

const panels = [...document.querySelectorAll('.skill-panel')];
const progressBar = document.querySelector('.skill-scroll-progress span');
let progressFrame = 0;
let maxScroll = 0;

const observer = new IntersectionObserver((entries, instance) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    instance.unobserve(entry.target);
  });
}, { threshold: .28 });

panels.forEach((panel) => observer.observe(panel));

const updateProgress = () => {
  if (!progressBar) return;
  progressBar.style.height = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
};

const measurePage = () => {
  maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  updateProgress();
};

window.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(() => {
    progressFrame = 0;
    updateProgress();
  });
}, { passive: true });
window.addEventListener('resize', measurePage, { passive: true });
measurePage();

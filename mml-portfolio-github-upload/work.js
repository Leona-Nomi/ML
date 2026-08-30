const progress = document.querySelector('.scroll-progress span');
const cards = document.querySelectorAll('.project-card');
let progressFrame = 0;
let maxScroll = 0;

const updateProgress = () => {
  if (!progress) return;
  progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
};

const measurePage = () => {
  maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  updateProgress();
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: .22 });

cards.forEach((card) => observer.observe(card));
window.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(() => {
    progressFrame = 0;
    updateProgress();
  });
}, { passive: true });
window.addEventListener('resize', measurePage, { passive: true });
measurePage();

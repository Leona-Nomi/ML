const page = document.body;
const nextPage = page.dataset.nextPage;
const previousPage = page.dataset.previousPage;
const sentinel = document.querySelector('.page-chain-sentinel');
const pageLabels = {
  'skills.html': '下一页：个人经历',
  'work.html': '下一页：项目',
  'recognitions.html': '下一页：了解我',
  'contact.html': '下一页：联系我',
};

if (nextPage && sentinel) {
  const link = document.createElement('a');
  link.className = 'page-chain-link';
  link.href = nextPage;
  link.textContent = pageLabels[nextPage] || '继续浏览下一页';
  sentinel.replaceChildren(link);
}

const edgeGap = 24;
let isNavigating = false;
let touchStartY = null;
let lastScrollY = window.scrollY;

const atTop = () => window.scrollY <= edgeGap;
const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - edgeGap;

const moveToPage = (target) => {
  if (!target || isNavigating) return;
  isNavigating = true;
  page.classList.add('is-page-chain-navigating');
  window.setTimeout(() => {
    window.location.href = target;
  }, 160);
};

const handleDirection = (direction) => {
  if (direction > 0 && nextPage && atBottom()) {
    moveToPage(nextPage);
    return true;
  }

  if (direction < 0 && previousPage && atTop()) {
    moveToPage(previousPage);
    return true;
  }

  return false;
};

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const movingDown = currentScrollY > lastScrollY;
  lastScrollY = currentScrollY;
  if (movingDown && nextPage && atBottom()) moveToPage(nextPage);
}, { passive: true });

window.addEventListener('wheel', (event) => {
  if (handleDirection(event.deltaY)) event.preventDefault();
}, { passive: false });

window.addEventListener('touchstart', (event) => {
  touchStartY = event.touches[0]?.clientY ?? null;
}, { passive: true });

window.addEventListener('touchend', (event) => {
  if (touchStartY === null) return;
  const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
  const distance = touchStartY - touchEndY;
  touchStartY = null;
  if (Math.abs(distance) < 42) return;
  handleDirection(distance);
}, { passive: true });

window.addEventListener('keydown', (event) => {
  if (event.target.matches('input, textarea, select, button, [contenteditable="true"]')) return;
  const down = event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ';
  const up = event.key === 'ArrowUp' || event.key === 'PageUp';
  if ((down && handleDirection(1)) || (up && handleDirection(-1))) event.preventDefault();
});

const menuButton = document.querySelector('.site-menu-toggle');
const siteNavigation = document.getElementById('main-navigation');

const setMenuState = (open, { focusLink = false } = {}) => {
  if (!menuButton || !siteNavigation) return;

  siteNavigation.classList.toggle('is-open', open);
  document.body.classList.toggle('site-menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航');

  if (open && focusLink) siteNavigation.querySelector('a')?.focus();
};

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  setMenuState(open, { focusLink: open });
});

siteNavigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || menuButton?.getAttribute('aria-expanded') !== 'true') return;
  setMenuState(false);
  menuButton.focus();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) setMenuState(false);
}, { passive: true });

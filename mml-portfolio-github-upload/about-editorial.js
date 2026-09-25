const aboutScenes = [...document.querySelectorAll('[data-about-pair]')];
const desktopMotion = window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (start, end, progress) => start + (end - start) * progress;
const smoothstep = (progress) => progress * progress * (3 - (2 * progress));

let animationFrame = 0;

const clearSceneStyles = (scene) => {
  scene.querySelectorAll('.about-story').forEach((card) => {
    card.style.removeProperty('--about-card-x');
    card.style.removeProperty('--about-card-y');
    card.style.removeProperty('--about-card-rotate');
    card.style.removeProperty('--about-card-scale');
    card.style.removeProperty('--about-card-opacity');
  });

  const reveal = scene.querySelector('.about-pair-reveal');
  reveal?.style.removeProperty('--about-reveal-opacity');
  reveal?.style.removeProperty('--about-reveal-y');
  reveal?.style.removeProperty('--about-reveal-scale');
  reveal?.classList.remove('is-interactive');

  scene.querySelector('.about-pair-stage')?.style.removeProperty('--about-dark-progress');

  const hint = scene.querySelector('.about-pair-hint');
  hint?.style.removeProperty('--about-hint-opacity');
};

const setPageDarkProgress = (progress) => {
  const dark = clamp(progress) * 100;
  document.documentElement.style.setProperty('--about-contact-dark', `${dark.toFixed(2)}%`);
  document.documentElement.style.setProperty('--about-contact-light', `${(100 - dark).toFixed(2)}%`);
  document.documentElement.classList.toggle('about-contact-header-dark', dark >= 50);
};

const sceneProgress = (scene) => {
  const bounds = scene.getBoundingClientRect();
  const travel = Math.max(1, bounds.height - window.innerHeight);
  return clamp(-bounds.top / travel);
};

const renderScene = (scene) => {
  const stage = scene.querySelector('.about-pair-stage');
  const leftCard = scene.querySelector('.about-story--left');
  const rightCard = scene.querySelector('.about-story--right');
  const reveal = scene.querySelector('.about-pair-reveal');
  const hint = scene.querySelector('.about-pair-hint');
  if (!stage || !leftCard || !rightCard || !reveal) return;

  const focusMode = scene.dataset.focusMode;
  const rawProgress = focusMode === 'cards' ? 0 : focusMode === 'reveal' ? 1 : sceneProgress(scene);
  const progress = smoothstep(rawProgress);
  const stageWidth = stage.clientWidth;
  const stageHeight = stage.clientHeight;
  // offsetWidth is transform-independent, so repeated scroll frames never
  // feed a rotated bounding-box width back into the next position.
  const cardWidth = leftCard.offsetWidth;

  const initialOffset = cardWidth * .17;
  // The small rotation widens the visual bounding box, so .36 leaves about
  // 15% of each finished card visible at the viewport edge in practice.
  const finalOffset = (stageWidth * .5) + (cardWidth * .36);
  const leftX = lerp(-initialOffset, -finalOffset, progress);
  const rightX = lerp(initialOffset, finalOffset, progress);
  const verticalOffset = stageHeight * .032;
  const cardScale = lerp(1, .98, progress);
  const cardOpacity = lerp(1, .62, progress);

  if (scene.classList.contains('about-pair-scene--contact')) {
    stage.style.setProperty('--about-dark-progress', progress.toFixed(4));
    setPageDarkProgress(progress);
  }

  leftCard.style.setProperty('--about-card-x', `${leftX.toFixed(2)}px`);
  leftCard.style.setProperty('--about-card-y', `${lerp(-verticalOffset, 0, progress).toFixed(2)}px`);
  leftCard.style.setProperty('--about-card-rotate', `${lerp(-5.5, -7.5, progress).toFixed(2)}deg`);
  leftCard.style.setProperty('--about-card-scale', cardScale.toFixed(4));
  leftCard.style.setProperty('--about-card-opacity', cardOpacity.toFixed(4));

  rightCard.style.setProperty('--about-card-x', `${rightX.toFixed(2)}px`);
  rightCard.style.setProperty('--about-card-y', `${lerp(verticalOffset, 0, progress).toFixed(2)}px`);
  rightCard.style.setProperty('--about-card-rotate', `${lerp(5, 7, progress).toFixed(2)}deg`);
  rightCard.style.setProperty('--about-card-scale', cardScale.toFixed(4));
  rightCard.style.setProperty('--about-card-opacity', cardOpacity.toFixed(4));

  const revealProgress = smoothstep(clamp((rawProgress - .2) / .58));
  reveal.style.setProperty('--about-reveal-opacity', revealProgress.toFixed(4));
  reveal.style.setProperty('--about-reveal-y', `${lerp(40, 0, revealProgress).toFixed(2)}px`);
  reveal.style.setProperty('--about-reveal-scale', lerp(.97, 1, revealProgress).toFixed(4));
  reveal.classList.toggle('is-interactive', rawProgress >= .7 || focusMode === 'reveal');

  if (hint) {
    const hintOpacity = 1 - clamp(rawProgress / .22);
    hint.style.setProperty('--about-hint-opacity', hintOpacity.toFixed(4));
  }
};

const renderScenes = () => {
  animationFrame = 0;
  if (!desktopMotion.matches) return;
  aboutScenes.forEach(renderScene);
};

const requestRender = () => {
  if (!desktopMotion.matches || animationFrame) return;
  animationFrame = window.requestAnimationFrame(renderScenes);
};

const syncMotionMode = () => {
  document.documentElement.classList.toggle('about-motion-ready', desktopMotion.matches);

  if (!desktopMotion.matches) {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    aboutScenes.forEach(clearSceneStyles);
    document.documentElement.style.removeProperty('--about-contact-dark');
    document.documentElement.style.removeProperty('--about-contact-light');
    document.documentElement.classList.remove('about-contact-header-dark');
    return;
  }

  requestRender();
};

aboutScenes.forEach((scene) => {
  scene.addEventListener('focusin', (event) => {
    scene.dataset.focusMode = event.target.closest('.about-pair-reveal') ? 'reveal' : 'cards';
    requestRender();
  });

  scene.addEventListener('focusout', () => {
    window.requestAnimationFrame(() => {
      if (scene.contains(document.activeElement)) return;
      delete scene.dataset.focusMode;
      requestRender();
    });
  });
});

window.addEventListener('scroll', requestRender, { passive: true });
window.addEventListener('resize', requestRender, { passive: true });
window.addEventListener('load', requestRender, { once: true });
desktopMotion.addEventListener('change', syncMotionMode);

syncMotionMode();

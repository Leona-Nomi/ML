'use strict';

const interactionCarousel = document.querySelector('.interaction-carousel');
const interactionTrack = document.querySelector('.interaction-track');
const interactionCards = [...document.querySelectorAll('.interaction-card')];
const interactionDots = [...document.querySelectorAll('.interaction-guide button')];
const interactionCount = document.querySelector('[data-current-slide]');
const heroDoor = document.querySelector('.interaction-door--hero');
const heroVisual = document.querySelector('.interaction-hero-visual');

if (interactionCarousel && interactionTrack && interactionCards.length && interactionDots.length) {
  const slideCount = interactionDots.length;
  const transitionDuration = 760;
  const autoplayDelay = 3000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let interactionIndex = 0;
  let interactionTimer = 0;
  let cloneResetTimer = 0;
  let resizeFrame = 0;
  let lastScrollY = window.scrollY;
  let scrollFrame = 0;
  let heroDoorArmed = false;
  let heroDoorArmScrollY = window.scrollY;

  const setHeroDoorOpen = (isOpen) => {
    if (!heroDoor || !heroVisual) return;
    const shouldOpen = reducedMotion.matches ? true : isOpen;
    heroDoor.classList.toggle('is-open', shouldOpen);
    heroVisual.classList.toggle('is-door-open', shouldOpen);
    heroVisual.classList.toggle('is-door-closed', !shouldOpen);
  };

  const getHeroDoorVisibility = () => {
    if (!heroVisual) return { isPresented: false, isBefore: false, isPast: false };

    const rect = heroVisual.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const safeTop = Math.min(96, viewportHeight * .12);
    const safeBottom = Math.min(24, viewportHeight * .04);
    const availableHeight = Math.max(0, viewportHeight - safeTop - safeBottom);
    const visibleTop = Math.max(rect.top, safeTop);
    const visibleBottom = Math.min(rect.bottom, viewportHeight - safeBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const targetHeight = Math.min(rect.height, availableHeight);

    return {
      isPresented: targetHeight > 0 && visibleHeight >= targetHeight * .96,
      isBefore: rect.top >= viewportHeight - safeBottom,
      isPast: rect.bottom <= safeTop,
    };
  };

  const syncHeroDoorDirection = () => {
    scrollFrame = 0;
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    if (Math.abs(scrollDelta) > 1) {
      const visibility = getHeroDoorVisibility();
      const openDistance = Math.max(48, Math.min(96, window.innerHeight * .08));

      if (scrollDelta < 0) {
        setHeroDoorOpen(false);
        heroDoorArmed = visibility.isPresented;
        heroDoorArmScrollY = currentScrollY;
      } else if (visibility.isBefore || (!heroDoorArmed && visibility.isPast)) {
        heroDoorArmed = false;
        heroDoorArmScrollY = currentScrollY;
        setHeroDoorOpen(false);
      } else if (!heroDoorArmed) {
        setHeroDoorOpen(false);
        if (visibility.isPresented) {
          heroDoorArmed = true;
          heroDoorArmScrollY = currentScrollY;
        }
      } else if (currentScrollY - heroDoorArmScrollY >= openDistance) {
        setHeroDoorOpen(true);
      }
    }

    lastScrollY = currentScrollY;
  };

  const stopAutoplay = () => {
    window.clearInterval(interactionTimer);
    interactionTimer = 0;
  };

  const updateInteractionState = (index) => {
    const activeIndex = index % slideCount;

    interactionDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });

    interactionCards.forEach((card, cardIndex) => {
      const isClone = cardIndex >= slideCount;
      const isActive = !isClone && cardIndex === activeIndex;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-hidden', String(!isActive));
    });

    if (interactionCount) {
      interactionCount.textContent = String(activeIndex + 1).padStart(2, '0');
    }
  };

  const moveInteraction = (index, animate = true) => {
    const targetCard = interactionCards[index];
    if (!targetCard) return;

    const shouldAnimate = animate && !reducedMotion.matches;
    interactionTrack.style.transitionDuration = shouldAnimate ? `${transitionDuration}ms` : '0ms';
    interactionTrack.style.transform = `translate3d(${-targetCard.offsetLeft}px, 0, 0)`;
    updateInteractionState(index);
  };

  const normalizeLoop = () => {
    if (interactionIndex !== slideCount) return;
    interactionIndex = 0;
    moveInteraction(interactionIndex, false);
  };

  const scheduleLoopReset = () => {
    window.clearTimeout(cloneResetTimer);
    cloneResetTimer = window.setTimeout(
      normalizeLoop,
      reducedMotion.matches ? 20 : transitionDuration + 60,
    );
  };

  const advanceInteraction = () => {
    if (interactionIndex >= slideCount) {
      interactionIndex = 0;
      moveInteraction(interactionIndex, false);
    }

    interactionIndex += 1;
    moveInteraction(interactionIndex);

    if (interactionIndex === slideCount) scheduleLoopReset();
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (document.hidden) return;
    interactionTimer = window.setInterval(advanceInteraction, autoplayDelay);
  };

  const selectInteraction = (index, focusDot = false) => {
    window.clearTimeout(cloneResetTimer);
    interactionIndex = index;
    moveInteraction(interactionIndex);
    if (focusDot) interactionDots[interactionIndex]?.focus();
    startAutoplay();
  };

  interactionDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      selectInteraction(Number(dot.dataset.slide));
    });

    dot.addEventListener('keydown', (event) => {
      const currentIndex = Number(dot.dataset.slide);
      let nextIndex = currentIndex;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % slideCount;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + slideCount) % slideCount;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = slideCount - 1;
      if (nextIndex === currentIndex) return;

      event.preventDefault();
      selectInteraction(nextIndex, true);
    });
  });

  window.addEventListener('resize', () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => moveInteraction(interactionIndex, false));
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }
    startAutoplay();
  });

  reducedMotion.addEventListener('change', () => moveInteraction(interactionIndex, false));

  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(syncHeroDoorDirection);
  }, { passive: true });

  moveInteraction(0, false);
  setHeroDoorOpen(false);
  startAutoplay();
}

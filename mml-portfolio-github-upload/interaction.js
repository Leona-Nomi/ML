'use strict';

const interactionCarousel = document.querySelector('.interaction-carousel');
const interactionTrack = document.querySelector('.interaction-track');
const interactionCards = [...document.querySelectorAll('.interaction-card')];
const interactionDots = [...document.querySelectorAll('.interaction-guide button')];
const interactionCount = document.querySelector('[data-current-slide]');

if (interactionCarousel && interactionTrack && interactionCards.length && interactionDots.length) {
  const slideCount = interactionDots.length;
  const transitionDuration = 1100;
  const autoplayDelay = 6500;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let interactionIndex = 0;
  let interactionTimer = 0;
  let cloneResetTimer = 0;
  let resizeFrame = 0;
  let hoverPaused = false;
  let focusPaused = false;

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

    interactionCards.slice(0, slideCount).forEach((card, cardIndex) => {
      card.setAttribute('aria-hidden', String(cardIndex !== activeIndex));
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
    if (hoverPaused || focusPaused || document.hidden) return;
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

      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % slideCount;
      if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + slideCount) % slideCount;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = slideCount - 1;
      if (nextIndex === currentIndex) return;

      event.preventDefault();
      selectInteraction(nextIndex, true);
    });
  });

  interactionCarousel.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    hoverPaused = true;
    stopAutoplay();
  });

  interactionCarousel.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    hoverPaused = false;
    startAutoplay();
  });

  interactionCarousel.addEventListener('focusin', () => {
    focusPaused = true;
    stopAutoplay();
  });

  interactionCarousel.addEventListener('focusout', (event) => {
    if (interactionCarousel.contains(event.relatedTarget)) return;
    focusPaused = false;
    startAutoplay();
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

  moveInteraction(0, false);
  startAutoplay();
}

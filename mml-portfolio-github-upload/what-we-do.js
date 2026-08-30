const whatStage = document.querySelector('.what-stage');
const whatCircle = document.querySelector('.what-circle');
let whatFrame = 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateWhatCircle = () => {
  whatFrame = 0;
  if (!whatStage || !whatCircle) return;

  const scrollLimit = Math.max(1, whatStage.offsetHeight - window.innerHeight);
  const progress = clamp(window.scrollY / scrollLimit, 0, 1);
  const circleSize = 43.2;
  const coverScale = Math.hypot(window.innerWidth, window.innerHeight) * 1.25 / circleSize;
  const scale = .82 + progress * (coverScale - .82);

  whatCircle.style.setProperty('--what-circle-scale', scale.toFixed(3));
};

const requestWhatCircleUpdate = () => {
  if (!whatFrame) whatFrame = window.requestAnimationFrame(updateWhatCircle);
};

window.addEventListener('scroll', requestWhatCircleUpdate, { passive: true });
window.addEventListener('resize', requestWhatCircleUpdate);
requestWhatCircleUpdate();

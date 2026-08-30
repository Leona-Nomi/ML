const recognitionTrack = document.querySelector('.recognitions-track');
let isDragging = false;
let dragStart = 0;
let dragOffset = 0;

recognitionTrack?.addEventListener('pointerdown', (event) => {
  isDragging = true;
  dragStart = event.clientX;
  recognitionTrack.setPointerCapture(event.pointerId);
  recognitionTrack.style.animationPlayState = 'paused';
});

recognitionTrack?.addEventListener('pointermove', (event) => {
  if (!isDragging) return;
  dragOffset += event.clientX - dragStart;
  dragStart = event.clientX;
  recognitionTrack.style.transform = `translateX(${dragOffset}px)`;
});

const stopDragging = () => {
  isDragging = false;
};

recognitionTrack?.addEventListener('pointerup', stopDragging);
recognitionTrack?.addEventListener('pointercancel', stopDragging);

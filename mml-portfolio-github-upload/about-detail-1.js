const aboutDetailReveals = document.querySelectorAll('.about-detail-reveal');

const aboutDetailObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .14 });

aboutDetailReveals.forEach((section) => aboutDetailObserver.observe(section));

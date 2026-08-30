const aboutItems = [...document.querySelectorAll('.about-story, .about-statement')];

const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    aboutObserver.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -12%', threshold: .14 });

aboutItems.forEach((item) => aboutObserver.observe(item));

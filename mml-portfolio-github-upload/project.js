const projects = {
  campaign: {
    number: '01', title: 'RE:FRAME', type: 'PUBLIC RELATIONS', year: '2025',
    description: '围绕品牌活动建立从主题、内容到现场体验的完整传播路径。'
  },
  visual: {
    number: '03', title: '金蝶云星空项目', type: '项目助理 / ERP', year: '2025.05—08',
    description: '参与企业建模、业务流程梳理与 ERP 系统优化，协助团队推进财务业务一体化。'
  },
  portfolio: {
    number: '03', title: 'STAY CURIOUS', type: 'DIGITAL EXPERIENCE', year: '2026',
    description: '把个人经历整理成一个可以浏览、停留和继续探索的数字空间。'
  }
};

const current = new URLSearchParams(window.location.search).get('project') || 'campaign';
const project = projects[current] || projects.campaign;

if (current === 'portfolio') {
  window.location.replace('interaction.html');
}

document.title = `MML / ${project.title}`;
document.querySelector('[data-detail-kicker]').textContent = `PROJECT / ${project.number}`;
document.querySelector('[data-detail-title]').textContent = project.title;
document.querySelector('[data-detail-description]').textContent = project.description;
document.querySelector('[data-detail-type]').textContent = project.type;
document.querySelector('[data-detail-year]').textContent = project.year;

const visualAccordion = document.querySelector('[data-visual-accordion]');
if (visualAccordion && current === 'visual') {
  visualAccordion.hidden = false;
  document.body.classList.add('visual-project-page');
}

document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const isOpen = item.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });
});

const nextPage = document.body.dataset.nextPage;
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

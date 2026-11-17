const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const drawer = document.querySelector('.mobile-drawer');
function closeMenu() {
  if (drawer.open) drawer.close();
  drawer.after(navigation);
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  drawer.append(navigation);
  menu.setAttribute('aria-expanded', 'true');
  drawer.showModal();
});
drawer.querySelector('.drawer-close').addEventListener('click', closeMenu);
drawer.addEventListener('cancel', event => {
  event.preventDefault();
  closeMenu();
});
drawer.addEventListener('click', event => {
  if (event.target === drawer && event.clientX < drawer.getBoundingClientRect().left) closeMenu();
});
navigation.addEventListener('click', event => {
  if (drawer.open && event.target.closest('a')) closeMenu();
});
matchMedia('(max-width: 1100px)').addEventListener('change', closeMenu);
document.querySelectorAll('[data-whatsapp], [data-treatment]').forEach(link => {
  const treatment = link.dataset.treatment;
  const message = treatment
    ? `Olá, Dra. Jaqueline! Vi seu site e gostaria de conversar sobre ${treatment} e agendar uma avaliação.`
    : 'Olá, Dra. Jaqueline! Vim pelo seu site e gostaria de agendar uma avaliação. Quais são os horários disponíveis?';
  link.href = `https://wa.me/5511986183972?text=${encodeURIComponent(message)}`;
});
document.querySelectorAll('.treatment-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.treatment-list details').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();

const filters = document.querySelector('.album-filters');
const photos = [...document.querySelectorAll('.gallery-photo')];
const results = photos.filter(item => item.dataset.category !== 'Clínica');
const resultsGrid = document.querySelector('.results-grid');
const resultPairs = [...resultsGrid.querySelectorAll('.result-pair')];
const galleryMotion = matchMedia('(prefers-reduced-motion: reduce)');
const galleryAnimations = new Set();
const revealedPairs = new WeakSet();
let requestedCategory;
let visibleCategory;
let categoryChange = 0;
const viewer = document.querySelector('#story-view');
const photo = viewer.querySelector('.story-photo');
let slides = [];
let position = 0;

function alignIndicator() {
  const active = filters.querySelector('[aria-pressed="true"]');
  if (!active) return;
  filters.style.setProperty('--tab-x', active.offsetLeft + 'px');
  filters.style.setProperty('--tab-y', active.offsetTop + active.offsetHeight - 1 + 'px');
  filters.style.setProperty('--tab-width', active.offsetWidth + 'px');
}

function animateGallery(element, frames, options) {
  const animation = element.animate(frames, options);
  galleryAnimations.add(animation);
  // Cancelled transitions are expected when someone selects another filter quickly.
  return animation.finished.catch(() => {}).then(() => {
    galleryAnimations.delete(animation);
    animation.cancel();
  });
}

function revealResult(element, index = 0) {
  if (element.classList.contains('result-pair')) revealedPairs.add(element);
  if (galleryMotion.matches || !element.animate) return Promise.resolve();
  return animateGallery(element, [
    { opacity: 0, transform: 'translateY(16px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], {
    duration: 440, delay: Math.min(index, 3) * 65,
    easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'backwards'
  });
}

function displayCategory(category) {
  visibleCategory = category;
  const selection = results.filter(item => item.dataset.category === category);
  resultsGrid.style.setProperty('--columns', Math.min(4, selection.length));
  for (const item of results) item.hidden = item.dataset.category !== category;
  for (const pair of resultPairs) pair.hidden = pair.dataset.category !== category;
}

async function selectCategory(category) {
  if (category === requestedCategory) return;
  requestedCategory = category;
  const change = ++categoryChange;
  for (const animation of galleryAnimations) animation.cancel();
  galleryAnimations.clear();
  for (const option of filters.children) {
    option.setAttribute('aria-pressed', String(option.textContent === category));
  }
  alignIndicator();
  // The initial render and reduced-motion mode need no animated transition.
  if (!visibleCategory || galleryMotion.matches || !resultsGrid.animate) {
    displayCategory(category);
    return;
  }
  await animateGallery(resultsGrid, [
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: 'translateY(-8px)' }
  ], { duration: 140, easing: 'ease-in', fill: 'forwards' });
  if (change !== categoryChange) return;
  displayCategory(category);
  [...resultsGrid.children].filter(item => !item.hidden).forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    // Offscreen comparisons keep their own entrance when reached by scrolling.
    if (item.classList.contains('result-pair') && (rect.top >= innerHeight || rect.bottom <= 0)) return;
    revealResult(item, index);
  });
}

galleryMotion.addEventListener('change', () => {
  if (!galleryMotion.matches) return;
  ++categoryChange;
  for (const animation of galleryAnimations) animation.cancel();
  galleryAnimations.clear();
  if (requestedCategory) displayCategory(requestedCategory);
});

for (const category of new Set(results.map(item => item.dataset.category))) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = category;
  button.onclick = () => selectCategory(category);
  filters.append(button);
}
selectCategory('Lentes');
new ResizeObserver(alignIndicator).observe(filters);
document.fonts.ready.then(alignIndicator);

function showSlide(index) {
  if (closing) return;
  const previous = position;
  position = (index + slides.length) % slides.length;
  const item = slides[position];
  const thumbnail = item.querySelector('img');
  if (viewer.open && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const direction = index < previous ? -1 : 1;
    photo.getAnimations().forEach(animation => animation.cancel());
    photo.animate([
      { opacity: 0.3, transform: 'translateX(' + direction * 14 + 'px)' },
      { opacity: 1, transform: 'translateX(0)' }
    ], { duration: 310, easing: 'cubic-bezier(.2,.75,.2,1)' });
  }
  photo.src = thumbnail.dataset.fullSrc || thumbnail.src;
  photo.alt = thumbnail.alt;
  viewer.querySelector('strong').textContent = item.dataset.case
    ? `${item.dataset.caseTitle} · ${item.dataset.stage}` : item.dataset.category;
  viewer.querySelector('a').href = item.href;
  viewer.querySelector('[data-count]').textContent = (position + 1) + ' de ' + slides.length;
}

const casePhotos = [...document.querySelectorAll('.case-preview')];
for (const item of [...photos, ...casePhotos]) {
  item.setAttribute('aria-haspopup', 'dialog');
  item.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    slides = item.dataset.case
      ? photos.filter(other => other.dataset.case === item.dataset.case)
      : casePhotos.includes(item) ? casePhotos : photos.filter(other => other.dataset.category === item.dataset.category);
    viewer.querySelector('[data-original-label]').textContent = casePhotos.includes(item) ? 'Ver publicação completa no Instagram' : 'Ver destaque completo no Instagram';
    showSlide(slides.indexOf(item));
    viewer.showModal();
    zoomPhoto(item, false);
  });
}
let closing = false;
function zoomPhoto(item, reverse) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const small = item.querySelector('img').getBoundingClientRect();
  const large = photo.getBoundingClientRect();
  if (!large.width || !large.height || small.bottom < 0 || small.top > innerHeight) return;
  const scale = Math.min(small.width / large.width, small.height / large.height);
  const x = small.left + small.width / 2 - large.left - large.width / 2;
  const y = small.top + small.height / 2 - large.top - large.height / 2;
  photo.getAnimations().forEach(animation => animation.cancel());
  const frames = [
    { transform: 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')', opacity: .55 },
    { transform: 'none', opacity: 1 }
  ];
  return photo.animate(reverse ? frames.reverse() : frames, {
    duration: reverse ? 190 : 300, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'backwards'
  });
}

async function closePhoto() {
  if (closing) return;
  closing = true;
  try {
    const animation = zoomPhoto(slides[position], true);
    if (animation) await animation.finished.catch(() => {});
  } finally {
    viewer.close();
    closing = false;
  }
}
viewer.querySelector('[data-close]').onclick = closePhoto;
viewer.addEventListener('cancel', event => {
  event.preventDefault();
  closePhoto();
});
viewer.querySelector('[data-prev]').onclick = () => showSlide(position - 1);
viewer.querySelector('[data-next]').onclick = () => showSlide(position + 1);
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showSlide(position - 1);
  if (event.key === 'ArrowRight') showSlide(position + 1);
});
let touchStart;
photo.addEventListener('touchstart', event => {
  touchStart = event.changedTouches[0].clientX;
}, { passive: true });
photo.addEventListener('touchend', event => {
  const delta = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(delta) > 45) showSlide(position + (delta < 0 ? 1 : -1));
}, { passive: true });

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const entrances = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('entered');
      entrances.unobserve(entry.target);
    }
  }, { threshold: 0.15 });
  document.querySelectorAll('.section h2, .clinic-grid').forEach(element => entrances.observe(element));
}

// Parallax nas fotos; controles e rolagem permanecem nativos.
(() => {
  const frames = [...document.querySelectorAll('.hero-portrait, .clinic-grid > .gallery-photo')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let request = 0;
  function update() {
    request = 0;
    const mobile = innerWidth <= 700;
    for (const frame of frames) {
      const rect = frame.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) continue;
      const progress = Math.max(-1, Math.min(1,
        (innerHeight / 2 - rect.top - rect.height / 2) / ((innerHeight + rect.height) / 2)));
      const hero = frame.classList.contains('hero-portrait');
      const limit = mobile ? 18 : hero ? 65 : 38;
      const distance = Math.min(limit, rect.height * (mobile ? 0.04 : 0.085));
      frame.style.setProperty('--photo-offset', `${(progress * distance).toFixed(2)}px`);
    }
  }
  function schedule() {
    if (!reduced.matches && !document.hidden && !request) request = requestAnimationFrame(update);
  }
  function configure() {
    cancelAnimationFrame(request);
    request = 0;
    frames.forEach(frame => {
      frame.classList.toggle('photo-parallax', !reduced.matches);
      frame.style.removeProperty('--photo-offset');
    });
    schedule();
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  document.addEventListener('load', schedule, true);
  document.addEventListener('visibilitychange', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
  reduced.addEventListener('change', configure);
  configure();
})();

// Entrada única, sem ocultar conteúdo quando JavaScript ou animações não estão disponíveis.
if ('IntersectionObserver' in window) {
  const comparisons = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!revealedPairs.has(entry.target)) revealResult(entry.target);
      comparisons.unobserve(entry.target);
    }
  }, { threshold: 0.15 });
  document.querySelectorAll('.result-pair').forEach(pair => comparisons.observe(pair));
}

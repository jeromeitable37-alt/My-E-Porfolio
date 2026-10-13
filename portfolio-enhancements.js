/* Jerome Itable — Portfolio 2.0 enhancements
   Additive UI layer. Existing cards, descriptions, image assets, modal data and
   the visible Google Docs links remain the source of the portfolio content.
*/
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const grid = $('.work-grid');
  const cards = $$('.work-card[data-category]');
  if (!grid || !cards.length) return;

  const favoriteKey = 'jerome-portfolio-favorites-v1';
  let favorites = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(favoriteKey) || '[]');
    if (Array.isArray(saved)) favorites = new Set(saved);
  } catch (_) {
    favorites = new Set();
  }

  const metadata = {
    empathy: { period: 'Midterm', subject: 'IC 3', date: '2026-10-02', skills: ['Empathy', 'Perspective-taking', 'Listening'] },
    stress: { period: 'Midterm', subject: 'IC 3', date: '', skills: ['Self-awareness', 'Emotional management', 'Stress management'] },
    communication: { period: 'Midterm', subject: 'IC 3', date: '', skills: ['Communication', 'Active listening', 'Feedback'] },
    ei: { period: 'Prelim', subject: 'IC 2', date: '', skills: ['Self-awareness', 'Emotional management'] },
    activity11: { period: 'Prelim', subject: 'IC 2', date: '', skills: ['Self-awareness', 'Emotional management', 'Reflection'] },
    self: { period: 'Prelim', subject: 'IC 2', date: '', skills: ['Self-management', 'Responsibility', 'Emotional management'] },
    activity3: { period: 'Prelim', subject: 'IC 2', date: '', skills: ['Self-awareness', 'Emotional management'] },
    kind: { period: 'Prelim', subject: 'IC 2', date: '', skills: ['Kindness', 'Empathy', 'Community'] },
    character: { period: 'Prelim', subject: 'Values', date: '', skills: ['Character', 'Respect', 'Responsibility'] },
    competence: { period: 'Prelim', subject: 'Values', date: '', skills: ['Competence', 'Perseverance', 'Learning'] },
    creative: { period: 'Prelim', subject: 'Values', date: '', skills: ['Creativity', 'Problem-solving', 'Learning'] },
    collab: { period: 'Prelim', subject: 'Values', date: '', skills: ['Collaboration', 'Teamwork', 'Communication'] },
    community: { period: 'Prelim', subject: 'Values', date: '', skills: ['Community', 'Responsibility', 'Kindness'] },
    jobfair: { period: 'Other', subject: 'Career', date: '', skills: ['Career readiness', 'Communication', 'Responsibility'] }
  };

  const skillsMap = [
    { title: 'Self-awareness', key: 'Self-awareness', desc: 'Recognizing emotions, habits and areas to improve.' },
    { title: 'Emotional management', key: 'Emotional management', desc: 'Thinking through reactions and coping with stress.' },
    { title: 'Empathy & listening', key: 'Empathy', desc: 'Considering others’ perspectives and listening patiently.' },
    { title: 'Communication', key: 'Communication', desc: 'Expressing ideas respectfully and receiving feedback.' },
    { title: 'Teamwork & community', key: 'Teamwork', desc: 'Doing your part and contributing to shared activities.' },
    { title: 'Career readiness', key: 'Career readiness', desc: 'Preparing for work-related activities and company visits.' }
  ];

  function titleOf(card) {
    const title = $('h3', $('.work-body', card) || card);
    return title ? title.textContent.trim() : 'IC activity';
  }

  function slugify(value) {
    return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function metadataKey(card) {
    if (card.dataset.documentUrl) {
      const title = titleOf(card).toLowerCase();
      if (title.includes('walking in someone else')) return 'empathy';
      if (title.includes('stress') || title.includes('emotional management plan')) return 'stress';
      if (title.includes('communication skills')) return 'communication';
    }
    return card.dataset.modal || '';
  }

  cards.forEach((card, index) => {
    const title = titleOf(card);
    const meta = metadata[metadataKey(card)] || {
      period: card.dataset.category === 'career' ? 'Other' : 'Prelim',
      subject: card.dataset.category === 'career' ? 'Career' : (card.dataset.category === 'values' ? 'Values' : 'IC 2'),
      date: '',
      skills: []
    };

    card.id = card.id || 'activity-' + slugify(title || String(index + 1));
    card.dataset.activityTitle = title;
    card.dataset.period = meta.period;
    card.dataset.subject = meta.subject;
    card.dataset.activityDate = meta.date || '';
    card.dataset.skills = (meta.skills || []).join('|');

    // The visible Google Docs button is the canonical target for whole-card clicks.
    const documentLink = $('.activity-document-link[href]', card);
    if (documentLink && documentLink.href) card.dataset.documentUrl = documentLink.href;

    const workBody = $('.work-body', card);
    if (!workBody || $('.activity-action-row', workBody)) return;

    const actions = document.createElement('div');
    actions.className = 'activity-action-row';

    const detailsButton = document.createElement('button');
    detailsButton.type = 'button';
    detailsButton.className = 'activity-quickview';
    detailsButton.textContent = 'Quick view';
    detailsButton.setAttribute('aria-label', 'Quick view: ' + title);

    const favoriteButton = document.createElement('button');
    favoriteButton.type = 'button';
    favoriteButton.className = 'favorite-btn';
    favoriteButton.dataset.favoriteId = card.id;
    favoriteButton.setAttribute('aria-pressed', String(favorites.has(card.id)));
    favoriteButton.setAttribute('aria-label', (favorites.has(card.id) ? 'Remove saved activity: ' : 'Save activity: ') + title);
    favoriteButton.textContent = favorites.has(card.id) ? '★ Saved' : '☆ Save';

    const shareButton = document.createElement('button');
    shareButton.type = 'button';
    shareButton.className = 'share-activity-btn';
    shareButton.textContent = 'Share ↗';
    shareButton.setAttribute('aria-label', 'Copy a share link for ' + title);

    actions.append(detailsButton, favoriteButton, shareButton);
    workBody.appendChild(actions);
  });

  const filterRow = $('.filter-row');
  if (filterRow && !$('#portfolioDashboard')) {
    filterRow.insertAdjacentHTML('beforebegin',
      "<section class='portfolio-dashboard' id='portfolioDashboard' aria-label='Portfolio overview'>" +
        "<div class='dashboard-heading'><div><p class='kicker'>MY LEARNING JOURNEY</p><h3>My portfolio at a glance.</h3></div><span class='dashboard-live-mark'><i></i> ACTIVITY INDEX</span></div>" +
        "<div class='dashboard-metrics'>" +
          "<div class='dashboard-metric'><strong id='metricTotal'>0</strong><span>Total activities</span></div>" +
          "<div class='dashboard-metric'><strong id='metricPrelim'>0</strong><span>Prelim outputs</span></div>" +
          "<div class='dashboard-metric'><strong id='metricMidterm'>0</strong><span>Midterm outputs</span></div>" +
          "<div class='dashboard-metric'><strong id='metricIC2'>0</strong><span>IC 2 activities</span></div>" +
          "<div class='dashboard-metric'><strong id='metricIC3'>0</strong><span>IC 3 activities</span></div>" +
        "</div><div class='favorites-shelf' id='favoritesShelf' hidden></div>" +
      "</section>" +
      "<section class='activity-explorer' aria-label='Find and manage activities'>" +
        "<div class='explorer-search'><label for='activitySearch'>Find an activity</label><div class='search-field-wrap'><span aria-hidden='true'>⌕</span><input id='activitySearch' type='search' placeholder='Search title, subject, or skill…' autocomplete='off'><kbd>SEARCH</kbd></div></div>" +
        "<div class='explorer-selects'>" +
          "<label for='periodFilter'>Period<select id='periodFilter'><option value='all'>All periods</option><option value='Prelim'>Prelim</option><option value='Midterm'>Midterm</option><option value='Other'>Other activities</option></select></label>" +
          "<label for='subjectFilter'>Subject<select id='subjectFilter'><option value='all'>All subjects</option><option value='IC 2'>IC 2</option><option value='IC 3'>IC 3</option><option value='Values'>Values</option><option value='Career'>Career</option></select></label>" +
          "<button type='button' id='favoritesFilterBtn' class='utility-chip' aria-pressed='false'>☆ Saved only</button>" +
        "</div>" +
        "<div class='portfolio-utilities'>" +
          "<button type='button' id='reviewerModeBtn' class='utility-chip'>▤ Reviewer mode</button>" +
          "<button type='button' id='readingModeBtn' class='utility-chip'>☷ Reflection reading mode</button>" +
          "<button type='button' id='printPortfolioBtn' class='utility-chip'>↓ Save / Print PDF</button>" +
          "<button type='button' id='sharePortfolioBtn' class='utility-chip'>↗ Share portfolio</button>" +
          "<button type='button' id='showQrBtn' class='utility-chip'>▦ QR code</button>" +
        "</div>" +
        "<p id='portfolioStatus' class='portfolio-status' aria-live='polite'>Use search and filters to find an activity.</p>" +
      "</section>"
    );
  }

  if (grid && !$('#learningTimeline')) {
    grid.insertAdjacentHTML('afterend',
      "<section class='learning-timeline' id='learningTimeline' aria-labelledby='timelineTitle'>" +
        "<div class='feature-section-heading'><div><p class='kicker'>FROM PRELIM TO MIDTERM</p><h3 id='timelineTitle'>My learning journey.</h3></div><p>Grouped by period. Dates appear only where they are available in the portfolio records.</p></div>" +
        "<div class='timeline-list' id='timelineList'></div>" +
      "</section>" +
      "<section class='skills-map' id='skillsMap' aria-labelledby='skillsMapTitle'>" +
        "<div class='feature-section-heading'><div><p class='kicker'>WHAT THESE ACTIVITIES PRACTICE</p><h3 id='skillsMapTitle'>Learning outcomes &amp; skills.</h3></div><p>Select a skill to find related activities. These connections are based on the activity descriptions.</p></div>" +
        "<div class='skills-map-grid' id='skillsMapGrid'></div>" +
      "</section>"
    );
  }

  const modal = $('#mediaModal');
  const modalImage = $('#modalImg');
  const modalImageWrap = $('.modal-img-wrap', modal || document);
  if (modal && modalImage && modalImageWrap && !$('#galleryModalControls')) {
    modalImage.insertAdjacentHTML('afterend',
      "<div class='gallery-modal-controls' id='galleryModalControls' aria-label='Photo navigation'>" +
        "<button type='button' id='galleryPrev' aria-label='Previous photo'>← Previous</button>" +
        "<button type='button' id='galleryZoom' aria-pressed='false'>Zoom</button>" +
        "<button type='button' id='galleryNext' aria-label='Next photo'>Next →</button>" +
      "</div>"
    );
  }

  if (!$('#activityDetailModal')) {
    document.body.insertAdjacentHTML('beforeend',
      "<div class='activity-detail-modal' id='activityDetailModal' aria-hidden='true'>" +
        "<div class='activity-detail-scrim' data-detail-close></div>" +
        "<section class='activity-detail-panel' role='dialog' aria-modal='true' aria-labelledby='activityDetailTitle'>" +
          "<button class='activity-detail-close' type='button' data-detail-close aria-label='Close activity details'>×</button>" +
          "<div class='activity-detail-visual' id='activityDetailVisual'><img id='activityDetailImage' alt='' hidden><div id='activityDetailCover'></div></div>" +
          "<div class='activity-detail-copy'><span id='activityDetailKicker' class='activity-detail-kicker'></span><h2 id='activityDetailTitle'></h2><p id='activityDetailMeta' class='activity-detail-meta'></p><p id='activityDetailDescription'></p><div id='activityDetailSkills' class='activity-skill-tags'></div><div class='activity-detail-actions'><a id='activityDetailOpen' class='btn primary' href='#' target='_blank' rel='noopener noreferrer'>Open activity ↗</a><button id='activityDetailPreview' class='btn ghost' type='button' hidden>View image ↗</button><button id='activityDetailShare' class='btn ghost' type='button'>Share link</button></div></div>" +
        "</section>" +
      "</div>" +
      "<div class='portfolio-qr-modal' id='portfolioQrModal' aria-hidden='true'><div class='portfolio-qr-scrim' data-qr-close></div><section class='portfolio-qr-panel' role='dialog' aria-modal='true' aria-labelledby='portfolioQrTitle'><button type='button' class='activity-detail-close' data-qr-close aria-label='Close QR code'>×</button><p class='kicker'>SHARE MY E-PORTFOLIO</p><h3 id='portfolioQrTitle'>Scan to visit my portfolio.</h3><img id='portfolioQrImage' alt='QR code for Jerome Itable IC Portfolio'><p>Scan with a phone camera to open the public portfolio.</p><a id='portfolioQrOpen' class='text-btn' target='_blank' rel='noopener noreferrer'>Open QR image ↗</a></section></div>" +
      "<div class='portfolio-toast' id='portfolioToast' role='status' aria-live='polite'></div>"
    );
  }

  function metaFor(card) {
    return {
      title: titleOf(card),
      period: card.dataset.period || 'Other',
      subject: card.dataset.subject || 'IC Work',
      date: card.dataset.activityDate || '',
      skills: (card.dataset.skills || '').split('|').filter(Boolean)
    };
  }

  function updateDashboard() {
    const set = (id, value) => { const node = $('#' + id); if (node) node.textContent = String(value); };
    set('metricTotal', cards.length);
    set('metricPrelim', cards.filter(card => card.dataset.period === 'Prelim').length);
    set('metricMidterm', cards.filter(card => card.dataset.period === 'Midterm').length);
    set('metricIC2', cards.filter(card => card.dataset.subject === 'IC 2').length);
    set('metricIC3', cards.filter(card => card.dataset.subject === 'IC 3').length);
  }

  function announce(message) {
    const toast = $('#portfolioToast');
    const status = $('#portfolioStatus');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      window.clearTimeout(announce.timeout);
      announce.timeout = window.setTimeout(() => toast.classList.remove('show'), 2600);
    }
    if (status) status.textContent = message;
  }

  function renderFavoriteShelf() {
    const shelf = $('#favoritesShelf');
    if (!shelf) return;
    shelf.replaceChildren();
    if (!favorites.size) { shelf.hidden = true; return; }
    const label = document.createElement('span');
    label.className = 'favorites-shelf-label';
    label.textContent = 'SAVED FOR QUICK ACCESS';
    shelf.appendChild(label);
    cards.filter(card => favorites.has(card.id)).forEach(card => {
      const link = document.createElement('a');
      link.href = '#' + card.id;
      link.textContent = titleOf(card);
      link.addEventListener('click', event => {
        event.preventDefault();
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        openActivityDetails(card);
      });
      shelf.appendChild(link);
    });
    shelf.hidden = false;
  }

  function persistFavorites() {
    try { localStorage.setItem(favoriteKey, JSON.stringify(Array.from(favorites))); } catch (_) {}
    renderFavoriteShelf();
    if (typeof window.applyWorkFilter === 'function') window.applyWorkFilter();
  }

  function openActivityDetails(card) {
    const layer = $('#activityDetailModal');
    if (!layer) return;
    const title = titleOf(card);
    const meta = metaFor(card);
    const body = $('.work-body', card);
    const description = $$('p', body).find(p => !p.classList.contains('activity-meta'));
    const image = $('.work-image img', card);
    const cover = $('.work-image.activity-cover', card);
    const detailImage = $('#activityDetailImage');
    const coverSlot = $('#activityDetailCover');
    const skills = $('#activityDetailSkills');

    $('#activityDetailTitle').textContent = title;
    $('#activityDetailMeta').textContent = [meta.period, meta.subject, meta.date].filter(Boolean).join(' · ');
    $('#activityDetailDescription').textContent = description ? description.textContent.trim() : 'Activity evidence from my IC portfolio.';
    $('#activityDetailKicker').textContent = 'IC PORTFOLIO · ' + (card.dataset.category || 'ACTIVITY').toUpperCase();
    detailImage.hidden = true;
    detailImage.removeAttribute('src');
    coverSlot.replaceChildren();

    if (image) {
      detailImage.src = image.currentSrc || image.src;
      detailImage.alt = image.alt || title;
      detailImage.hidden = false;
    } else if (cover) {
      const clone = cover.cloneNode(true);
      clone.classList.add('activity-detail-cover-clone');
      coverSlot.appendChild(clone);
    }

    skills.replaceChildren();
    meta.skills.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'activity-skill-tag';
      tag.textContent = skill;
      skills.appendChild(tag);
    });

    const openLink = $('#activityDetailOpen');
    const link = $('.activity-document-link[href]', card);
    if (link) { openLink.href = link.href; openLink.hidden = false; }
    else { openLink.hidden = true; }

    const preview = $('#activityDetailPreview');
    preview.hidden = !card.dataset.modal;
    preview.onclick = () => {
      closeActivityDetails();
      const visual = $('.work-image', card);
      if (visual) visual.click();
    };
    $('#activityDetailShare').onclick = () => shareActivity(card);
    layer.classList.add('open');
    layer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('activity-detail-open');
    $('[data-detail-close]', layer)?.focus();
  }

  function closeActivityDetails() {
    const layer = $('#activityDetailModal');
    if (!layer) return;
    layer.classList.remove('open');
    layer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('activity-detail-open');
  }

  async function copyText(value, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const temp = document.createElement('textarea');
        temp.value = value;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        const ok = document.execCommand('copy');
        temp.remove();
        if (!ok) throw new Error('Copy unavailable');
      }
      announce(successMessage || 'Copied to clipboard.');
    } catch (_) {
      announce('Copy was blocked by the browser. Use the visible document link instead.');
    }
  }

  function activityUrl(card) {
    return window.location.origin + window.location.pathname + '#' + card.id;
  }

  async function shareActivity(card) {
    const url = activityUrl(card);
    if (navigator.share) {
      try {
        await navigator.share({ title: titleOf(card), text: 'IC portfolio activity', url });
        announce('Activity link shared.');
        return;
      } catch (error) {
        if (error && error.name === 'AbortError') return;
      }
    }
    await copyText(url, 'Activity link copied.');
  }

  // Combined filtering: category chips plus search, period, subject, saved items and skill.
  function updateFilteredCards() {
    const query = ($('#activitySearch')?.value || '').trim().toLowerCase();
    const period = $('#periodFilter')?.value || 'all';
    const subject = $('#subjectFilter')?.value || 'all';
    const category = window.portfolioCategoryFilter || 'all';
    const favoritesOnly = document.body.classList.contains('favorites-only');
    const skill = document.body.dataset.skillFilter || '';
    let visible = 0;

    cards.forEach(card => {
      const text = (card.textContent + ' ' + card.dataset.period + ' ' + card.dataset.subject + ' ' + card.dataset.skills).toLowerCase();
      const matches = (!query || text.includes(query)) &&
        (period === 'all' || card.dataset.period === period) &&
        (subject === 'all' || card.dataset.subject === subject) &&
        (category === 'all' || card.dataset.category === category) &&
        (!favoritesOnly || favorites.has(card.id)) &&
        (!skill || (card.dataset.skills || '').split('|').includes(skill));
      card.classList.toggle('is-hidden', !matches);
      card.setAttribute('aria-hidden', String(!matches));
      if (matches) visible++;
    });

    const result = $('#portfolioStatus');
    if (result) result.textContent = 'Showing ' + visible + ' of ' + cards.length + ' activities' + (favoritesOnly ? ' · saved only' : '') + (skill ? ' · skill: ' + skill : '') + '.';
  }

  window.applyPortfolioFilters = updateFilteredCards;
  window.portfolioCategoryFilter = window.portfolioCategoryFilter || 'all';
  if (typeof window.applyWorkFilter === 'function') {
    const originalApply = window.applyWorkFilter;
    window.applyWorkFilter = function (filter) {
      if (filter !== undefined) window.portfolioCategoryFilter = filter;
      originalApply(window.portfolioCategoryFilter);
      updateFilteredCards();
    };
  }

  $('#activitySearch')?.addEventListener('input', updateFilteredCards);
  $('#periodFilter')?.addEventListener('change', updateFilteredCards);
  $('#subjectFilter')?.addEventListener('change', updateFilteredCards);
  $('#favoritesFilterBtn')?.addEventListener('click', event => {
    const active = document.body.classList.toggle('favorites-only');
    event.currentTarget.setAttribute('aria-pressed', String(active));
    event.currentTarget.textContent = active ? '★ Saved only · On' : '☆ Saved only';
    updateFilteredCards();
  });

  cards.forEach(card => {
    $('.activity-quickview', card)?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      openActivityDetails(card);
    });

    $('.favorite-btn', card)?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (favorites.has(card.id)) favorites.delete(card.id);
      else favorites.add(card.id);
      const button = event.currentTarget;
      button.textContent = favorites.has(card.id) ? '★ Saved' : '☆ Save';
      button.setAttribute('aria-pressed', String(favorites.has(card.id)));
      button.setAttribute('aria-label', (favorites.has(card.id) ? 'Remove saved activity: ' : 'Save activity: ') + titleOf(card));
      persistFavorites();
      announce(favorites.has(card.id) ? 'Activity saved for quick access.' : 'Activity removed from saved items.');
    });

    $('.share-activity-btn', card)?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      shareActivity(card);
    });
  });

  function createTimeline() {
    const list = $('#timelineList');
    if (!list) return;
    list.replaceChildren();
    const order = { Prelim: 0, Midterm: 1, Other: 2 };
    const sorted = cards.slice().sort((a, b) => {
      const aa = metaFor(a), bb = metaFor(b);
      return (order[aa.period] ?? 3) - (order[bb.period] ?? 3) ||
        (aa.date || '9999').localeCompare(bb.date || '9999') ||
        aa.title.localeCompare(bb.title);
    });
    let lastPeriod = '';
    sorted.forEach(card => {
      const meta = metaFor(card);
      if (meta.period !== lastPeriod) {
        const heading = document.createElement('h4');
        heading.className = 'timeline-period-heading';
        heading.textContent = meta.period;
        list.appendChild(heading);
        lastPeriod = meta.period;
      }
      const item = document.createElement('article');
      item.className = 'timeline-item';
      const dot = document.createElement('span');
      dot.className = 'timeline-dot';
      dot.setAttribute('aria-hidden', 'true');
      const copy = document.createElement('div');
      copy.className = 'timeline-item-copy';
      const small = document.createElement('span');
      small.textContent = [meta.subject, meta.date].filter(Boolean).join(' · ');
      const title = document.createElement('strong');
      title.textContent = meta.title;
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'timeline-open-btn';
      open.textContent = 'Details ↗';
      open.addEventListener('click', () => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        openActivityDetails(card);
      });
      copy.append(small, title);
      item.append(dot, copy, open);
      list.appendChild(item);
    });
  }

  function createSkillsMap() {
    const root = $('#skillsMapGrid');
    if (!root) return;
    root.replaceChildren();
    skillsMap.forEach(skill => {
      const related = cards.filter(card => {
        const values = (card.dataset.skills || '').split('|');
        return values.includes(skill.key) || (skill.key === 'Empathy' && values.includes('Perspective-taking'));
      });
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'skills-map-card';
      button.setAttribute('aria-pressed', String(document.body.dataset.skillFilter === skill.key));
      const heading = document.createElement('strong');
      heading.textContent = skill.title;
      const description = document.createElement('span');
      description.textContent = skill.desc;
      const count = document.createElement('small');
      count.textContent = related.length + ' related ' + (related.length === 1 ? 'activity' : 'activities');
      button.append(heading, description, count);
      button.addEventListener('click', () => {
        const active = document.body.dataset.skillFilter === skill.key;
        document.body.dataset.skillFilter = active ? '' : skill.key;
        $$('.skills-map-card').forEach(node => node.setAttribute('aria-pressed', String(node === button && !active)));
        if ($('#activitySearch')) $('#activitySearch').value = '';
        if ($('#periodFilter')) $('#periodFilter').value = 'all';
        if ($('#subjectFilter')) $('#subjectFilter').value = 'all';
        announce(active ? 'Skill filter cleared.' : 'Showing activities connected to ' + skill.title + '.');
        updateFilteredCards();
        $('.work-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      root.appendChild(button);
    });
  }

  $$('[data-detail-close]').forEach(node => node.addEventListener('click', closeActivityDetails));
  const qrModal = $('#portfolioQrModal');
  $$('[data-qr-close]').forEach(node => node.addEventListener('click', () => {
    qrModal?.classList.remove('open');
    qrModal?.setAttribute('aria-hidden', 'true');
  }));

  $('#reviewerModeBtn')?.addEventListener('click', event => {
    const active = document.body.classList.toggle('reviewer-mode');
    event.currentTarget.setAttribute('aria-pressed', String(active));
    event.currentTarget.textContent = active ? '✓ Reviewer mode · On' : '▤ Reviewer mode';
    announce(active ? 'Reviewer mode enabled. Animations and action controls are minimized.' : 'Reviewer mode disabled.');
  });

  $('#readingModeBtn')?.addEventListener('click', event => {
    const active = document.body.classList.toggle('reflection-reading-mode');
    event.currentTarget.setAttribute('aria-pressed', String(active));
    event.currentTarget.textContent = active ? '✓ Exit reading mode' : '☷ Reflection reading mode';
    $('.reflection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#printPortfolioBtn')?.addEventListener('click', () => window.print());

  $('#sharePortfolioBtn')?.addEventListener('click', async () => {
    const url = window.location.origin + window.location.pathname;
    if (navigator.share) {
      try { await navigator.share({ title: document.title, text: 'Jerome Itable — IC Portfolio', url }); return; }
      catch (error) { if (error && error.name === 'AbortError') return; }
    }
    await copyText(url, 'Portfolio link copied.');
  });

  $('#showQrBtn')?.addEventListener('click', () => {
    if (!qrModal) return;
    const url = window.location.origin + window.location.pathname;
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=' + encodeURIComponent(url);
    $('#portfolioQrImage').src = qrUrl;
    $('#portfolioQrOpen').href = qrUrl;
    qrModal.classList.add('open');
    qrModal.setAttribute('aria-hidden', 'false');
  });

  const reflectionTitle = $('.reflection .section-title');
  if (reflectionTitle) {
    const readingHint = document.createElement('p');
    readingHint.className = 'reading-mode-note';
    readingHint.textContent = 'Use Reflection reading mode above for a cleaner, wider reading layout.';
    reflectionTitle.insertAdjacentElement('afterend', readingHint);
  }

  updateDashboard();
  renderFavoriteShelf();
  createTimeline();
  createSkillsMap();
  updateFilteredCards();

  // Gallery lightbox controls. The card images remain unchanged.
  const photoButtons = $$('[data-image]');
  let galleryIndex = -1;
  let touchStartX = null;

  function openGalleryPhoto(button) {
    const src = button.dataset.image;
    if (!src || typeof window.openMedia !== 'function') return;
    galleryIndex = photoButtons.indexOf(button);
    const image = $('img', button);
    window.openMedia(null, { img: src, k: 'PHOTO GALLERY', t: image?.alt || 'Portfolio photo', d: 'A photo from my IC portfolio.' });
    modal?.classList.add('gallery-preview-open');
    if (modalImage) {
      modalImage.classList.remove('zoomed');
      modalImage.style.transform = '';
    }
    const zoomButton = $('#galleryZoom');
    if (zoomButton) {
      zoomButton.textContent = 'Zoom';
      zoomButton.setAttribute('aria-pressed', 'false');
    }
  }

  function moveGallery(amount) {
    if (!photoButtons.length) return;
    galleryIndex = (galleryIndex + amount + photoButtons.length) % photoButtons.length;
    openGalleryPhoto(photoButtons[galleryIndex]);
  }

  $('#galleryPrev')?.addEventListener('click', () => moveGallery(-1));
  $('#galleryNext')?.addEventListener('click', () => moveGallery(1));
  $('#galleryZoom')?.addEventListener('click', event => {
    if (!modalImage) return;
    const zoomed = !modalImage.classList.contains('zoomed');
    modalImage.classList.toggle('zoomed', zoomed);
    event.currentTarget.textContent = zoomed ? 'Fit image' : 'Zoom';
    event.currentTarget.setAttribute('aria-pressed', String(zoomed));
  });

  // Capture phase prevents the older one-photo listener from overriding this gallery viewer.
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-image]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openGalleryPhoto(button);
  }, true);

  document.addEventListener('click', event => {
    if (event.target.closest('[data-close]')) {
      modal?.classList.remove('gallery-preview-open');
      modalImage?.classList.remove('zoomed');
      galleryIndex = -1;
    }
  }, true);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeActivityDetails();
      qrModal?.classList.remove('open');
      modal?.classList.remove('gallery-preview-open');
    }
    if (modal?.classList.contains('gallery-preview-open')) {
      if (event.key === 'ArrowLeft') moveGallery(-1);
      if (event.key === 'ArrowRight') moveGallery(1);
    }
  });

  modalImage?.addEventListener('touchstart', event => {
    if (!modal?.classList.contains('gallery-preview-open') || !event.touches.length) return;
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  modalImage?.addEventListener('touchend', event => {
    if (touchStartX === null || !modal?.classList.contains('gallery-preview-open') || !event.changedTouches.length) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 55) moveGallery(delta > 0 ? -1 : 1);
    touchStartX = null;
  }, { passive: true });

  function handleActivityHash() {
    const hash = window.location.hash.slice(1);
    if (!hash.startsWith('activity-')) return;
    const card = document.getElementById(hash);
    if (!card || !card.classList.contains('work-card')) return;
    window.setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      openActivityDetails(card);
    }, 120);
  }
  window.addEventListener('hashchange', handleActivityHash);
  handleActivityHash();

  const ids = $$('[id]').map(node => node.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) console.warn('Portfolio duplicate IDs:', Array.from(new Set(duplicateIds)));
  cards.forEach(card => {
    const link = $('.activity-document-link[href]', card);
    if (link && card.dataset.documentUrl !== link.href) console.warn('Portfolio document target mismatch:', titleOf(card));
  });
})();
const body = document.body;

// Mark the page as JS-ready so reveal animations can safely run.
document.documentElement.classList.add('js-ready');
const menuBtn = document.getElementById('menuBtn');
const siteNav = document.getElementById('siteNav');
const themeBtn = document.getElementById('themeBtn');
const scrollProgress = document.getElementById('scrollProgress');
const modal = document.getElementById('mediaModal');
const modalImg = document.getElementById('modalImg');
const modalKicker = document.getElementById('modalKicker');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const heroProfile = document.getElementById('heroProfile');
const heroParticles = document.getElementById('heroParticles');

// Dark mode is the default. A user's choice is remembered after that.
const savedTheme = localStorage.getItem('jerome-theme');
body.classList.toggle('dark', savedTheme !== 'light');
if (themeBtn) themeBtn.textContent = body.classList.contains('dark') ? '☾' : '☼';

themeBtn?.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('jerome-theme', body.classList.contains('dark') ? 'dark' : 'light');
  themeBtn.textContent = body.classList.contains('dark') ? '☾' : '☼';
});

menuBtn?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});
siteNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => siteNav.classList.remove('open')));

window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollProgress) scrollProgress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  const sections = [...document.querySelectorAll('main section[id]')];
  let active = 'home';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 180) active = s.id; });
  document.querySelectorAll('#siteNav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${active}`));
}, { passive: true });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Small background stars for the first screen.
if (heroParticles && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  for (let i = 0; i < 34; i++) {
    const star = document.createElement('i');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--dur', `${5 + Math.random() * 6}s`);
    star.style.setProperty('--delay', `${-Math.random() * 7}s`);
    star.style.setProperty('--x', `${(Math.random() - .5) * 36}px`);
    star.style.setProperty('--y', `${(Math.random() - .5) * 36}px`);
    heroParticles.appendChild(star);
  }
}

// Gentle mouse parallax on the profile card.
if (heroProfile && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const hero = heroProfile.closest('.hero');
  hero?.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    heroProfile.style.transform = `perspective(1400px) rotateY(${(-7 + x * 6).toFixed(2)}deg) rotateX(${(2 - y * 4).toFixed(2)}deg) translate3d(${(x*4).toFixed(1)}px,${(y*4).toFixed(1)}px,0)`;
  });
  hero?.addEventListener('mouseleave', () => {
    heroProfile.style.transform = 'perspective(1400px) rotateY(-7deg) rotateX(2deg)';
  });
}

const media = {
  activity11: { img: 'assets/activity-1-1.jpg', k: 'ACTIVITY NO. 1.1', t: 'Emotional Quotient Reflection', d: 'A reflection about the traits I see in myself, how EQ helps me deal with challenges and relationships, and the areas I still want to improve.' },
  activity3: { img: 'assets/activity-no-3.jpg', k: 'ACTIVITY NO. 3', t: 'Emotional Self-Awareness', d: 'A self-reflection worksheet about emotions I experience, qualities that help me succeed, skills I need to improve, and how I respond when stressed.' },
  ei: { img: 'assets/434cb2b3-b1fe-479f-8aa1-fc5efa22acee.png', k: 'IC2 • EI SELF-EVALUATION 3', t: 'Emotional Intelligence', d: 'I used this activity to look at how I deal with emotions, pressure, and difficult situations.' },
  self: { img: 'assets/c878a0e1-407a-40b7-9fa9-ee444e7a4682.png', k: 'ACTIVITY NO. 4', t: 'Self-Management Plan', d: 'This is where I wrote about my reactions, the emotions I usually feel, and what I can do to respond better.' },
  kind: { img: 'assets/a13056d2-4636-4b8b-b042-9e33dff37318.png', k: '6-WEEK ACTIVITY', t: 'Random Acts of Kindness', d: 'My six-week list includes simple things like greeting people, helping others, returning borrowed things, and keeping shared spaces clean.' },
  character: { img: 'assets/220b03b1-3bd2-41b9-9296-36cc6cd46806.png', k: 'VALUE', t: 'Character', d: 'For me, character shows in the small choices I make and how I treat people every day.' },
  competence: { img: 'assets/29689079-e6ef-41dc-b764-3f3624973e5e.png', k: 'VALUE', t: 'Competence', d: 'I connect competence with practice, effort, learning from mistakes, and getting better over time.' },
  creative: { img: 'assets/3a04123c-59ca-46b0-acce-633ff0eed746.png', k: 'VALUE', t: 'Creativity', d: 'Creativity helps me look at a problem in another way and try a different idea.' },
  collab: { img: 'assets/b6dd3e79-4a7f-451b-ad19-497f875c6015.png', k: 'VALUE', t: 'Collaboration', d: 'Working with others means listening, helping, sharing ideas, and doing my part.' },
  community: { img: 'assets/f19b60cb-7f57-42ba-a046-e8c3c5cc49cd.png', k: 'VALUE', t: 'Community Commitment', d: 'I can help my community by doing my responsibilities and being willing to help when I can.' },
  jobfair: { img: 'assets/ae2d5c1f-993e-460e-a96b-ca29c43a6e26.png', k: 'CAREER PREPARATION', t: 'Job Fair Passport', d: 'This is my completed Job Fair Passport with the company visits I recorded during the school career fair.' },
  grade12: { img: 'assets/8747d464-86fb-4f29-bd6c-c98217798c7d.png', k: 'GRADE 12 • REGIONAL MATH & SCIENCE TRIVIA', t: '2nd Place — Jerome Itable', d: 'The result shows Jerome Itable from Sisters of Mary School-Adlas, Inc. listed in 2nd Place.' },
  astro: { img: 'assets/f577b369-1ad1-434a-975e-25693bc4033a.png', k: 'ASTRO QUIZ BOWL • 2022', t: 'Celestial Brain Buster', d: 'This is the Astro Quiz Bowl result and it stays with the Brain Buster title.' },
  grade11: { img: 'assets/3c79f30a-2f96-4b96-8607-99331c31a39b.png', k: 'GRADE 11 • REGIONAL ONLINE TRIVIA', t: '3rd Place — Jerome Itable', d: 'The result shows Jerome Itable with a score of 52 and a rank of 3rd Place.' }
};

function openMedia(key, direct = null) {
  const item = direct || media[key];
  if (!item) return;
  modalImg.src = item.img;
  modalImg.alt = item.t || 'Portfolio image';
  modalKicker.textContent = item.k || '';
  modalTitle.textContent = item.t || '';
  modalDesc.textContent = item.d || '';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  body.style.overflow = 'hidden';
}
function closeMedia() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  body.style.overflow = '';
}

document.querySelectorAll('[data-modal]').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('button')) return;
    openMedia(card.dataset.modal);
  });
});
document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeMedia));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMedia(); });

document.querySelectorAll('[data-image]').forEach(btn => {
  btn.addEventListener('click', () => openMedia(null, { img: btn.dataset.image, k: 'PHOTO', t: 'Portfolio photo', d: 'A photo I included in my IC portfolio.' }));
});

const kindnessBtn = document.getElementById('kindnessBtn');
const kindnessDrawer = document.getElementById('kindnessDrawer');
kindnessBtn?.addEventListener('click', () => {
  const open = kindnessDrawer.classList.toggle('open');
  const icon = kindnessBtn.querySelector('span');
  if (icon) icon.textContent = open ? '−' : '+';
});

document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  document.querySelectorAll('.work-card[data-category]').forEach(card => {
    card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
  });
}));


// Contact helpers
const emailAddress = 'jeromeitable.37@gmail.com';
const copyStatus = document.getElementById('copyStatus');
async function copyEmailAddress(){
  try{
    await navigator.clipboard.writeText(emailAddress);
    if(copyStatus) copyStatus.textContent='Email copied.';
  }catch{
    if(copyStatus) copyStatus.textContent='Copy failed — select the email manually.';
  }
}
document.getElementById('copyEmail')?.addEventListener('click', copyEmailAddress);
document.getElementById('copyEmailBottom')?.addEventListener('click', copyEmailAddress);

// Direct contact form submission via FormSubmit
const contactForm = document.getElementById('contactForm');
const contactFormStatus = document.getElementById('contactFormStatus');
contactForm?.addEventListener('submit', async (event)=>{
  event.preventDefault();
  const submitButton = document.getElementById('sendMessage');
  if(!submitButton) return;
  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending... <span>↗</span>';
  if(contactFormStatus) contactFormStatus.textContent = 'Sending your message...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: new FormData(contactForm)
    });
    const data = await response.json().catch(()=>({}));
    if(!response.ok || data.success === false) {
      throw new Error(data.message || 'Unable to send message.');
    }
    contactForm.reset();
    if(contactFormStatus) contactFormStatus.textContent = 'Message sent successfully. Thanks for reaching out!';
  } catch(error) {
    // Reliable fallback: open a pre-filled email if the form service is blocked.
    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const message = document.getElementById('contactMessage')?.value.trim() || '';
    const subject = 'Message from your IC E-Portfolio';
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if(contactFormStatus) contactFormStatus.textContent = 'Opening your email app as a backup...';
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send message <span>→</span>';
  }
});

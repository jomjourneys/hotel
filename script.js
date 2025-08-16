// js/script.js - main JS (dark blue theme, alternating rooms animation)
document.addEventListener('DOMContentLoaded', function () {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* ===== Mobile drawer toggle ===== */
  const body = document.body;
  const navToggle = document.querySelector('.nav-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const backdrop = document.querySelector('.nav-backdrop');
  const mainNav = document.querySelector('.main-nav');

  function openNav(){ body.classList.add('nav-open'); }
  function closeNav(){ body.classList.remove('nav-open'); }

  if (navToggle) navToggle.addEventListener('click', openNav);
  if (drawerClose) drawerClose.addEventListener('click', closeNav);
  if (backdrop) backdrop.addEventListener('click', closeNav);

  // ✅ Updated: Mobile nav link click => close & navigate naturally
  if (mainNav) {
    mainNav.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (!link) return;

      if (window.innerWidth < 1025) {
        const href = link.getAttribute('href');
        closeNav();

        // Agar same page anchor hai (#) to default allow karo
        if (href && href.startsWith('#')) {
          return; // Let browser scroll naturally
        }

        // Agar dusre page ka link hai to delay deke navigate karo
        e.preventDefault();
        setTimeout(() => {
          if (href) window.location.href = href;
        }, 150);
      }
    });
  }

  /* Footer years */
  ['year','year2','year3','year4','year5'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = new Date().getFullYear();
  });

  /* HERO slideshow (home only if slides exist) */
  (function heroSlideshow(){
    const slides = $$('.slide');
    const dotsWrap = document.querySelector('.slide-dots');
    if (!slides.length) return;
    let current = 0; const DURATION = 5200; let timer = null;

    function buildDots(){
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      slides.forEach((s,i)=>{
        const b=document.createElement('button');
        b.className='dot'; b.dataset.index=i;
        b.setAttribute('aria-label','Slide '+(i+1));
        b.addEventListener('click', ()=> goTo(i, true));
        dotsWrap.appendChild(b);
      });
    }
    function show(i){
      slides.forEach(s => s.classList.remove('active'));
      slides[i].classList.add('active');
      const dots=$$('.slide-dots .dot');
      dots.forEach((d,idx)=> d.style.background =
        idx===i ? 'linear-gradient(90deg,#1e90ff,#4da3ff)' : 'rgba(255,255,255,0.6)');
      const heroText = document.querySelector('.hero-text');
      if (heroText) { heroText.classList.remove('show'); setTimeout(()=> heroText.classList.add('show'), 80); }
    }
    function goTo(i,user=false){ if(i<0)i=slides.length-1; if(i>=slides.length)i=0; current=i; show(current); if(user) reset(); }
    function next(){ goTo(current+1); }
    function prev(){ goTo(current-1); }
    function start(){ stop(); timer = setInterval(next, DURATION); }
    function stop(){ if(timer){ clearInterval(timer); timer=null; } }
    function reset(){ stop(); start(); }

    buildDots(); show(0); start();

    const nextBtn = document.querySelector('.slide-next');
    const prevBtn = document.querySelector('.slide-prev');
    if (nextBtn) nextBtn.addEventListener('click', ()=> { next(); reset(); });
    if (prevBtn) prevBtn.addEventListener('click', ()=> { prev(); reset(); });

    const wrap = document.querySelector('.slideshow');
    if (wrap) { wrap.addEventListener('mouseenter', ()=> stop()); wrap.addEventListener('mouseleave', ()=> start()); }
  })();

  /* Scroll reveal — SKIP featured-rooms so it never hides */
  (function scrollReveal(){
    const allTargets = $$('[data-anim], .reveal, .reveal-left, .reveal-right');
    const targets = allTargets.filter(el => !el.closest('.featured-rooms'));
    if (!targets.length) return;

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){ entry.target.classList.add('show'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.14 });

    targets.forEach(el=> io.observe(el));

    setTimeout(()=> { const ht = document.querySelector('.hero-text'); if (ht) ht.classList.add('show'); }, 280);
  })();

  /* Smooth scroll to payment section */
  (function payScroll(){
    const payBtns = document.querySelectorAll('#payNowBtn, .pay-scroll');
    const target = document.getElementById('paymentBooking');
    if (!target) return;
    payBtns.forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        target.scrollIntoView({ behavior:'smooth', block:'center' });
        target.style.transition = 'box-shadow 300ms ease';
        target.style.boxShadow = '0 12px 40px rgba(30,144,255,0.35)';
        setTimeout(()=> target.style.boxShadow = '', 1400);
      });
    });
  })();

  /* Lightbox for gallery */
  (function lightbox(){
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const lbImg = lb.querySelector('.lb-img');
    const lbClose = lb.querySelector('.lb-close');
    const lbPrev = lb.querySelector('.lb-prev');
    const lbNext = lb.querySelector('.lb-next');
    const items = $$('.lightbox');
    const srcs = items.map(a => a.getAttribute('href'));
    let idx = -1;
    function open(i){ idx = i; lbImg.src = srcs[idx]; lb.classList.add('show'); document.body.style.overflow='hidden'; }
    function close(){ lb.classList.remove('show'); document.body.style.overflow=''; }
    function prev(){ idx = (idx -1 + srcs.length) % srcs.length; lbImg.src = srcs[idx]; }
    function next(){ idx = (idx +1) % srcs.length; lbImg.src = srcs[idx]; }

    items.forEach((a,i)=> a.addEventListener('click', e => { e.preventDefault(); open(i); }));
    lbClose && lbClose.addEventListener('click', close);
    lbPrev && lbPrev.addEventListener('click', prev);
    lbNext && lbNext.addEventListener('click', next);
    lb.addEventListener('click', (e)=> { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if(!lb.classList.contains('show')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowLeft') prev();
      if(e.key === 'ArrowRight') next();
    });
  })();
});
(function scrollReveal(){
  const allTargets = $$('[data-anim], .reveal, .reveal-left, .reveal-right');
  const targets = allTargets.filter(el => !el.closest('.featured-rooms'));
  if (!targets.length) return;

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(()=> entry.target.classList.add('show'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  targets.forEach(el => io.observe(el));

  setTimeout(()=> { 
    const ht = document.querySelector('.hero-text'); 
    if (ht) ht.classList.add('show'); 
  }, 280);
})();

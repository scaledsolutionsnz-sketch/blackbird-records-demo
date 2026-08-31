/* Blackbird Records, Te Puke */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* intro curtain */
  var intro = document.getElementById('intro');
  function closeIntro() {
    if (!intro) return;
    intro.classList.add('done');
    window.setTimeout(function () { if (intro && intro.parentNode) intro.parentNode.removeChild(intro); }, 1600);
  }
  if (intro) {
    if (reduce) { closeIntro(); }
    else { window.setTimeout(closeIntro, 900); }
  }

  /* build the email button link in JS so the address is never in the HTML */
  document.querySelectorAll('a[data-gmail]').forEach(function (a) {
    var to = a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
    a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
      '&su=' + (a.getAttribute('data-su') || '') +
      '&body=' + (a.getAttribute('data-body') || '');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* nav */
  var nav = document.querySelector('.nav');
  var menu = document.getElementById('mobileMenu');
  var burger = document.getElementById('burger');
  function onScroll() {
    if (nav) nav.classList.toggle('stuck', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (nav) nav.classList.add('stuck');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* scroll reveal */
  var items = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
  }

  /* rolling hero images */
  var slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1 && !reduce) {
    var s = 0;
    window.setInterval(function () {
      slides[s].classList.remove('on');
      s = (s + 1) % slides.length;
      slides[s].classList.add('on');
    }, 5600);
  }

  /* rolling hero review quotes, same source as the cards below */
  var QUOTES = window.BB_REVIEWS || [];
  var qText = document.getElementById('hqText');
  var qName = document.getElementById('hqName');
  if (qText && qName && QUOTES.length) {
    var q = 0;
    var paint = function () {
      qText.textContent = '“' + QUOTES[q].short + '”';
      qName.textContent = QUOTES[q].name + ', Google review';
    };
    paint();
    if (!reduce && QUOTES.length > 1) {
      window.setInterval(function () {
        qText.style.opacity = '0';
        qName.style.opacity = '0';
        window.setTimeout(function () {
          q = (q + 1) % QUOTES.length;
          paint();
          qText.style.opacity = '1';
          qName.style.opacity = '1';
        }, 500);
      }, 6200);
    }
  }

  /* footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

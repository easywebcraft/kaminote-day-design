/* 放デイのトップをにぎやかに（2026-10-17）。day-top-lively.css とセット。day-motion.js のあとに読む */
(function () {
  var motion = document.documentElement.classList.contains('tm-on') && 'IntersectionObserver' in window;

  // C 写真を包んで、後ろに色の丸を2つ置く（写真そのものは day-motion.js の現れ方のまま）
  var DOTS = { cases: ['is-y', 'is-s'], values: ['is-c', 'is-ring'], day: ['is-p', 'is-y'] };
  var phs = [];
  Object.keys(DOTS).forEach(function (id) {
    var sec = document.getElementById(id);
    if (!sec) return;
    var figs = sec.querySelectorAll('figure.dw-photo');
    figs.forEach(function (fig, i) {
      var w = document.createElement('div');
      w.className = 'lv-ph';
      fig.parentNode.insertBefore(w, fig);
      w.appendChild(fig);
      // 一日の流れは写真が3枚あるので、色の丸は1枚目にだけ
      if (id === 'day' && i > 0) return;
      DOTS[id].forEach(function (c) {
        var d = document.createElement('span');
        d.className = 'lv-dot ' + c;
        d.setAttribute('aria-hidden', 'true');
        w.appendChild(d);
      });
      phs.push(w);
    });
  });

  // E ことばの帯（多言語の段の上）。とぎれず流れるよう、同じ並びを2回つなぐ
  var multi = document.getElementById('multi');
  if (multi) {
    var words = ['こんにちは', 'Hello', 'Kumusta', 'Olá', 'Maayong adlaw'];
    var lang = ['ja', 'en', 'tl', 'pt', 'ceb'];
    var m = document.createElement('div');
    m.className = 'lv-marquee';
    m.setAttribute('aria-hidden', 'true');
    var t = document.createElement('div');
    t.className = 'lv-track';
    for (var r = 0; r < 4; r++) {
      words.forEach(function (wd, i) {
        var s = document.createElement('span');
        s.lang = lang[i];
        s.textContent = wd;
        t.appendChild(s);
        t.appendChild(document.createElement('i'));
      });
    }
    m.appendChild(t);
    multi.insertBefore(m, multi.firstChild);
  }

  // G 一日の流れの点に順番をつける
  document.querySelectorAll('.dw-tl').forEach(function (tl) {
    tl.querySelectorAll('li').forEach(function (li, i) { li.style.setProperty('--i', i); });
  });

  if (!motion) return;

  // G・H 画面に入ったら線をのばす（1回だけ）
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('lv-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -18% 0px' });
  document.querySelectorAll('.dw-tl, .dw-steps').forEach(function (el) { io.observe(el); });

  // J スクロールに合わせて、色の丸を少しずらす（奥行き）
  var ticking = false;
  function para() {
    ticking = false;
    var vh = window.innerHeight;
    phs.forEach(function (w) {
      var b = w.getBoundingClientRect();
      if (b.bottom < -100 || b.top > vh + 100) return;
      var k = ((b.top + b.height / 2) - vh / 2) / vh;  // 画面の真ん中で0
      w.querySelectorAll('.lv-dot').forEach(function (d, i) { d.style.setProperty('--py', (k * (i ? -28 : 40)).toFixed(1)); });
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(para); } }, { passive: true });
  para();
})();
